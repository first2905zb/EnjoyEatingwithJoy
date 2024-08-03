import {
    StyleSheet, Text, View, TouchableOpacity, Dimensions,
    TextInput, TouchableHighlight, Image, FlatList, Modal, Alert, Pressable,
    ActivityIndicator
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem } from '@rneui/base';
import * as Progress from 'react-native-progress';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from './Context';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const Menu = (props) => {
    const [select, setSelect] = useState(0);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredItems, setFilteredItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [costs, setCosts] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    // const user1 = 'anakin1';
    const [dataC, setDataC] = useState([]);
    const [userData, setUserData] = useState([]);
    const [lastData, setLastData] = useState();
    const [lastDataC, setLastDataC] = useState();
    const [quotaMax, setQuotaMax] = useState();
    const [instantValue, setInstantValue] = useState();
    const { username } = useContext(AuthContext)
    const consumefoodEnpoint = 'https://takoyakist1-first.com/health/consumefood';
    const userProgramEnpoint = 'https://takoyakist1-first.com/health/userprogram';
    const foodsEnpoint = 'https://takoyakist1-first.com/health/foods';

    useFocusEffect(
        useCallback(() => {
            setQuantities({});
            setSelectedItems([]);

            fetch(consumefoodEnpoint)
                .then(res => res.json())
                .then((result) => {
                    setDataC(result);
                    const lastDatas = getLastData(result);
                    setLastDataC(lastDatas);
                    if (moment().diff(moment(lastDatas.date, 'YYYY-MM-DD'), 'days') >= 1) {
                        setCosts(0);
                    }
                    else setCosts(lastDatas.cost);
                })
                .catch((error) => {
                    console.log('Error fetching consumefood:', error);
                });
        }, [])
    );

    useEffect(() => {
        Orientation.lockToPortrait();

        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    useEffect(() => {
        fetchData(foodsEnpoint, setItems)
        fetchData(foodsEnpoint, setFilteredItems)
        fetchData(consumefoodEnpoint, setDataC)
        fetchData(userProgramEnpoint, setUserData)
        setIsLoading(false);

    }, []);

    useEffect(() => {
        if (userData.length > 0) {
            const lastDatas = getLastData(userData);
            setLastData(lastDatas);
            setQuotaMax(lastDatas.quotaMax);
        }
    }, [userData]);

    useEffect(() => {
        if (dataC.length > 0) {
            const lastDatas = getLastData(dataC);
            setLastDataC(lastDatas);
            if (moment().diff(moment(lastDatas.date, 'YYYY-MM-DD'), 'days') >= 1) {
                setCosts(0);
            }
            else setCosts(lastDatas.cost);
        }
    }, [dataC]);

    useEffect(() => {
        const formattedQuery = searchQuery.toLowerCase();
        const filteredData = items.filter(item => contains(item.name, formattedQuery));
        setFilteredItems(filteredData);
    }, [searchQuery, items]);

    const getLastData = (data) => {
        const last = data.filter(user => user.username === username);
        return last[last.length - 1];
    };

    const selectPro = (item) => {
        switch (lastData && lastData.pro) {
            case 'k':
                return item.k;
            case 'na':
                return item.na;
            case 'po4':
                return item.po4;
            case 'alb':
                return item.alb;
            default:
                return 0; // or default value if needed
        }
    };

    const filterType = (type) => {
        setSelect(type);
        let filteredData = [];
        switch (type) {
            case 0:
                filteredData = items;
                break;
            case 1:
                filteredData = items.filter(item => item.type === 'ของคาว');
                break;
            case 2:
                filteredData = items.filter(item => item.type === 'ของหวาน');
                break;
            case 3:
                filteredData = items.filter(item => item.type === 'ผัก');
                break;
            case 4:
                filteredData = items.filter(item => item.type === 'ผลไม้');
                break;
            default:
                filteredData = items;
                break;
        }
        setFilteredItems(filteredData);
    };

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const incrementQuantity = () => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [selectedItem.name]: (prevQuantities[selectedItem.name] || 0) + 1
        }));
    };

    const decrementQuantity = () => {
        if (quantities[selectedItem.name] > 0) {
            const updatedQuantities = { ...quantities };
            updatedQuantities[selectedItem.name] -= 1;
            if (updatedQuantities[selectedItem.name] === 0) {
                delete updatedQuantities[selectedItem.name];
            }
            setQuantities(updatedQuantities);
        }
    };

    const contains = (name, query) => {
        return name.toLowerCase().includes(query);
    };

    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    };

    const save = () => {
        const updatedQuantities = quantities[selectedItem.name] > 0 ? {
            ...quantities,
            [selectedItem.name]: quantities[selectedItem.name]
        } : quantities;

        if (updatedQuantities[selectedItem.name] > 0) {
            const selectedData = {
                id: selectedItem.id,
                name: selectedItem.name,
                img: selectedItem.img,
                unit: selectedItem.unit,
                pro: selectPro(selectedItem),
                type: selectedItem.type,
                quantity: updatedQuantities[selectedItem.name]
            };

            setSelectedItems(prevSelectedItems => [
                ...prevSelectedItems.filter(item => item.id !== selectedItem.id),
                selectedData
            ]);
        } else {
            setSelectedItems(prevSelectedItems =>
                prevSelectedItems.filter(item => item.id !== selectedItem.id)
            );

        }

        let updatedCosts = costs;
        Object.keys(updatedQuantities).forEach(name => {
            const item = items.find(item => item.name === name);
            if (item) {
                updatedCosts += updatedQuantities[name] * selectPro(item);
            }
        });
        setCosts(updatedCosts);
        setInstantValue({ thPro: lastData.thPro, quotaMax: quotaMax, cost: updatedCosts, quantities: updatedQuantities, pp: lastData.pro });
        setModalVisible(false);
    };

    const gotoResult = () => {
        if (selectedItems.length <= 0) {
            Alert.alert('โปรดเลือกอาหาร');
        } else {
            props.navigation.navigate('Result', { selectedItems, instantValue, items });
        }
    };

    const progressPercent = quotaMax > 0 ? (costs / quotaMax) * 100 : 0;

    const renderModal = () => (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Closed.');
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.detail}>
                {selectedItem && (
                    <View style={styles.cardContainer}>
                        <Pressable style={styles.closeBut} onPress={() => setModalVisible(!modalVisible)}>
                            <Icon name='close' size={35} color={'#000'} />
                        </Pressable>
                        <View style={styles.head}>
                            <Image source={{ uri: selectedItem.img }} style={styles.img} />
                            <Text style={styles.headtxt}>{selectedItem.name}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
                            {[
                                { label: 'พลังงาน', value: selectedItem.kcal, unit: 'กิโลแคลอรี่' },
                                { label: 'โปรตีน', value: selectedItem.protein, unit: 'กรัม' },
                                { label: 'โซเดียม', value: selectedItem.na, unit: 'มิลลิกรัม' },
                                { label: 'โพแทสเซียม', value: selectedItem.k, unit: 'มิลลิกรัม' },
                                { label: 'ฟอสฟอรัส', value: selectedItem.po4, unit: 'มิลลิกรัม' },
                                { label: 'น้ำตาล', value: selectedItem.sugar, unit: 'กรัม' },
                                { label: 'ไขมัน', value: selectedItem.fat, unit: 'กรัม' },
                            ].map((item, index) => (
                                <View key={index} style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>{item.label}:</Text>
                                    <Text style={styles.infoValue}>{item.value}</Text>
                                    <Text style={styles.infoUnit}>{item.unit}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.quantity}>
                            <Pressable style={styles.inc} onPress={decrementQuantity}>
                                <Text style={[styles.normaltxt, { fontSize: 30 }]}>-</Text>
                            </Pressable>
                            <View style={{ borderWidth: 0.5, width: width * 0.18, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                                <Text style={[styles.normaltxt, { textAlignVertical: 'center', fontSize: 30 }]}>{quantities[selectedItem.name] || 0}</Text>
                            </View>
                            <Pressable style={styles.dec} onPress={incrementQuantity}>
                                <Text style={[styles.normaltxt, { fontSize: 30 }]}>+</Text>
                            </Pressable>
                        </View>
                        <TouchableOpacity style={styles.save} onPress={() => save()}>
                            <Text style={styles.normaltxt}>บันทึก</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );

    const fetchData = async (enpoint, setData) => {
        try {
            const res = await fetch(enpoint)
            const result = await res.json();
            setData(result)
        } catch (error) {
            console.log('error', error)
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
                    <Icon name='chevron-left' size={25} color={'black'} />
                </TouchableOpacity>
            </View>
            <View style={styles.topHead}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.in}
                        placeholder='พิมพ์เมนูที่ต้องการค้นหา...'
                        autoCapitalize='none'
                        autoCorrect={false}
                        clearButtonMode='always'
                        value={searchQuery}
                        onChangeText={(query) => handleSearch(query)}
                        placeholderTextColor="#000"
                    />
                    <Icon name='search' size={20} color={'#FFFFFF'} />
                </View>
                <Text style={[styles.normaltxt, { textAlign: 'center', marginVertical: 8, color: "#fff" }]}>หรือเลือกเมนูอาหารด้านล่าง</Text>
                <View style={styles.type}>
                    <TouchableHighlight underlayColor="#B1E5DC" style={[styles.chooseType, select === 0 ? { backgroundColor: '#B1E5DC' } : null]} onPress={() => filterType(0)}>
                        <Text style={[styles.normaltxt, select === 0 ? { color: '#000' } : { color: '#fff' }]}>ทั้งหมด</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#B1E5DC" style={[styles.chooseType, select === 1 ? { backgroundColor: '#B1E5DC' } : null]} onPress={() => filterType(1)}>
                        <Text style={[styles.normaltxt, select === 1 ? { color: '#000' } : { color: '#fff' }]}>ของคาว</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#B1E5DC" style={[styles.chooseType, select === 2 ? { backgroundColor: '#B1E5DC' } : null]} onPress={() => filterType(2)}>
                        <Text style={[styles.normaltxt, select === 2 ? { color: '#000' } : { color: '#fff' }]}>ของหวาน</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#B1E5DC" style={[styles.chooseType, select === 3 ? { backgroundColor: '#B1E5DC' } : null]} onPress={() => filterType(3)}>
                        <Text style={[styles.normaltxt, select === 3 ? { color: '#000' } : { color: '#fff' }]}>ผัก</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#B1E5DC" style={[styles.chooseType, select === 4 ? { backgroundColor: '#B1E5DC' } : null]} onPress={() => filterType(4)}>
                        <Text style={[styles.normaltxt, select === 4 ? { color: '#000' } : { color: '#fff' }]}>ผลไม้</Text>
                    </TouchableHighlight>
                </View>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={filteredItems}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <ListItem containerStyle={{ backgroundColor: '#D7EFE6', padding: 8 }}>
                            <ListItem.Content>
                                <TouchableOpacity style={styles.box} onPress={() => handleItemPress(item)}>
                                    <Image source={{ uri: item.img }} style={styles.img} />
                                    <View style={{ width: width * 0.35 }}>
                                        <Text style={[styles.normaltxt, { textAlign: 'center' }]}>{item.name}</Text>
                                        <Text style={[styles.normaltxt, { textAlign: 'center', color: '#888888' }]}>({item.unit})</Text>
                                    </View>
                                    <Text style={[styles.normaltxt, { fontSize: width * 0.095, color: '#22C7A9' }]}>{selectPro(item)}<Text style={[styles.normaltxt, { color: '#22C7A9' }]}>มก.</Text></Text>
                                </TouchableOpacity>
                            </ListItem.Content>
                        </ListItem>
                    )}
                />
            </View>
            <View style={styles.footer}>
                <View style={styles.progress}>
                    <View style={styles.score}>
                        <Text style={[styles.normaltxt, { color: '#fff' }]}>{lastData && lastData.thPro}</Text>
                        <Text style={[styles.normaltxt, { color: '#fff' }]}>{costs}/{lastData && lastData.quotaMax} มก/วัน</Text>
                    </View>
                    <View style={styles.progressbar}>
                        <Progress.Bar progress={progressPercent / 100} borderWidth={0} width={width * 0.76} unfilledColor='#B1E5DC' color='#D75581' />
                    </View>
                </View>
                <TouchableOpacity style={styles.result} onPress={() => gotoResult()}>
                    <Text style={styles.headtxt}>ดูผลสรุปที่ท่านเลือก</Text>
                    <Icon name='play' size={30} />
                </TouchableOpacity>
            </View>
            {renderModal()}
        </View>
    );
};

export default Menu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#22C7A9'
    },
    header: {
        height: height * 0.07,
        backgroundColor: '#D6E8E1',
        justifyContent: 'center',
        paddingLeft: width * 0.04
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 20,
        width: width * 0.88,
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 16,
        backgroundColor: '#D7EFE6'
    },
    input: {
        flex: 1,
        height: height * 0.07,
        color: '#000'
    },
    type: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    chooseType: {
        width: width * 0.18,
        height: height * 0.035,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    content: {
        height: height * 0.5,
        marginVertical: 8,
        borderRadius: 40,
        overflow: 'hidden',
        backgroundColor: '#D7EFE6',
    },
    box: {
        width: width,
        height: height * 0.13,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        marginLeft: -16,
        backgroundColor: '#F3F3F3',
        alignSelf: 'center',
        paddingHorizontal: 8
    },
    img: {
        width: width * 0.3,
        height: height * 0.13,
        resizeMode: 'cover',
        borderRadius: 25
    },
    footer: {
        alignSelf: 'center',
        width: width * 0.8,
        gap: 8,
    },
    progress: {
        // borderWidth: 1,
        // top: -8,
        backgroundColor: '#7CDCCB',
        height: height * 0.06,
        zIndex: -1,
        paddingHorizontal: 8
    },
    score: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // borderWidth: 1,
    },
    progressbar: {
        // borderWidth: 1,
        height: height * 0.015
    },
    result: {
        borderWidth: 1,
        flexDirection: 'row',
        height: height * 0.06,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#F3C1C2'
    },
    headtxt: {
        fontSize: width * 0.055,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    normaltxt: {
        fontSize: width * 0.035,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    detail: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    cardContainer: {
        width: width * 0.9,
        height: height * 0.77,
        backgroundColor: '#EFFDEE',
        borderRadius: 25,
        justifyContent: 'flex-start',
        padding: 16,
        gap: 16,
        // alignItems: 'center'
    },
    head: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.4,
        gap: 15
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    closeBut: {
        width: width * 0.08,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    quantity: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    inc: {
        width: width * 0.25,
        // height: height * 0.05,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dec: {
        width: width * 0.25,
        // height: height * 0.05,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    save: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        height: height * 0.07,
        backgroundColor: "#A7DCA5",
        borderRadius: 15
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 2
    },
    infoLabel: {
        width: '40%',
        textAlign: 'right',
        paddingRight: 8,
        fontSize: width * 0.035,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    infoValue: {
        width: '20%',
        textAlign: 'center',
        fontSize: width * 0.035,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    infoUnit: {
        width: '40%',
        textAlign: 'left',
        paddingLeft: 8,
        fontSize: width * 0.035,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
});

