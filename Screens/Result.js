import { Alert, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View, Modal } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BackgroundImage } from '@rneui/base';
import { AuthContext } from './Context';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';

const { width, height } = Dimensions.get('window');

const Result = (props) => {
    const { selectedItems, instantValue, items } = props.route.params;
    const { username } = useContext(AuthContext);
    const consumefoodEnpoint = 'https://takoyakist1-first.com/health/consumefood';
    const [abnormalList, setAbnormalList] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [stats, setStats] = useState(0);
    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    useEffect(() => {
        const fooditems = sumAll();
        setStats(fooditems);
        const ab = checkAbnormal(fooditems);
        setAbnormalList(ab)
        console.log(ab)
        if (ab.length > 0) {
            setModalVisible(true);
        }
    }, [selectedItems])
    console.log(stats)

    const sumAll = () => {
        const total = selectedItems.reduce((acc, sel) => {
            const filteredItems = items.filter(item => item.name === sel.name);
            const sumFilteredItems = filteredItems.reduce((acc, curr) => {
                return {
                    protein: acc.protein + (curr.protein * instantValue.quantities[sel.name]),
                    na: acc.na + (curr.na * instantValue.quantities[sel.name]),
                    k: acc.k + (curr.k * instantValue.quantities[sel.name]),
                    po4: acc.po4 + (curr.po4 * instantValue.quantities[sel.name]),
                    sugar: acc.sugar + (curr.sugar * instantValue.quantities[sel.name])
                };
            }, { protein: 0, na: 0, k: 0, po4: 0, sugar: 0 });

            return {
                protein: acc.protein + sumFilteredItems.protein,
                na: acc.na + sumFilteredItems.na,
                k: acc.k + sumFilteredItems.k,
                po4: acc.po4 + sumFilteredItems.po4,
                sugar: acc.sugar + sumFilteredItems.sugar
            };
        }, { protein: 0, na: 0, k: 0, po4: 0, sugar: 0 });

        return total;
    };

    const insertData = () => {
        fetch(consumefoodEnpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                cost: instantValue.cost,
                date: `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`
            }),
        })
            .then(respone => respone.json())
            .then(data => {
                console.log('Sucess:', data);
            })
            .catch((error) => {
                console.error('Error', error)
            })
        props.navigation.navigate('Home');
    }
    const renderFooter = () => {
        if (instantValue.cost <= instantValue.quotaMax) {
            return (
                <View style={styles.footer}>
                    <View style={styles.jibiContainer}>
                        <Image style={[styles.jibi, { transform: [{ scaleX: -1 }] }]} source={require('./../assets/image/happy.png')} />
                    </View>
                    <BackgroundImage style={styles.bgImg} source={{ uri: 'https://png.pngtree.com/png-clipart/20231109/ourmid/pngtree-cloud-speech-bubble-text-box-png-image_10522863.png' }}>
                        <View style={{ transform: [{ scaleX: -1 }] }}>
                            <Text style={[styles.normaltxt, { textAlign: 'center', marginBottom: -8 }]}>ยอดเยี่ยมค่ะ !</Text>
                            <Text style={styles.normaltxt}>น้องจอยกดไลค์ให้เลย</Text>
                        </View>
                    </BackgroundImage>
                </View>
            );
        } else {
            return (
                <View style={styles.footer}>
                    <View style={styles.jibiContainer}>
                        <Image style={styles.jibi} source={require('./../assets/image/angry.png')} />
                    </View>
                    {/* <View style={styles.lasttxt}> */}
                    <BackgroundImage style={styles.bgImg} source={{ uri: 'https://png.pngtree.com/png-clipart/20231109/ourmid/pngtree-cloud-speech-bubble-text-box-png-image_10522863.png' }}>
                        <View style={{ transform: [{ scaleX: -1 }] }}>
                            <Text style={[styles.normaltxt, { textAlign: 'center', marginBottom: -8 }]}>ไม่เห็นด้วยค่ะ</Text>
                            <Text style={styles.normaltxt}>เรามาเลือกกันใหม่นะ</Text>
                        </View>
                    </BackgroundImage>
                    {/* </View> */}
                </View>
            );
        }
    };

    const checkAbnormal = (foodItems) => {
        let alertmsg = [];
        if (foodItems.na > 4000) alertmsg.push({ stat: `${foodItems.na} (4000 มก.)`, alert: 'โซเดียม' })
        if (foodItems.k > 1500) alertmsg.push({ stat: `${foodItems.k} (1500 มก.)`, alert: 'โพแทสเซียม' })
        if (foodItems.po4 > 1000) alertmsg.push({ stat: `${foodItems.po4} (1000 มก.)`, alert: 'ฟอสฟอรัส' })
        if (foodItems.sugar > 30) alertmsg.push({ stat: `${foodItems.sugar} (30 ก.)`, alert: 'น้ำตาล' })
        return alertmsg;
    }

    console.log(stats && stats.na)

    return (
        <ScrollView style={styles.safeAreaView}>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.headtxt, { color: 'red' }]}>คำเตือน!!!</Text>
                        <Text style={styles.normaltxt}>อาหารที่ท่านเลือกมีปริมาณ</Text>
                        {abnormalList && abnormalList.map(item => (
                            <View key={item.alert} style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: width * 0.6 }}>
                                <Text style={{ color: '#D13F71', fontFamily: 'Mali-SemiBold' }}>{item.alert}สูง :</Text>
                                <Text style={{ color: 'red', fontFamily: 'Mali-SemiBold' }}>{item.stat}</Text>
                            </View>
                        ))}
                        <Pressable style={styles.closeBut} onPress={() => setModalVisible(!modalVisible)}>
                            <Icon name='close' size={35} color={"#000"} />
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={styles.goBack}>
                <Pressable style={styles.goBackBut} onPress={() => props.navigation.goBack()}>
                    <Icon name='chevron-left' size={25} />
                </Pressable>
            </View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.headtxt, { color: '#000' }]}>ผลสรุปที่ท่านเลือก</Text>
                </View>
                <View style={styles.foodItems}>
                    {selectedItems.map(item => (
                        <View key={item.id} style={styles.box}>
                            <View style={styles.imageContainer}>
                                <Image style={styles.img} source={{ uri: item.img }} />
                            </View>
                            <View style={styles.boxtxt}>
                                <Text style={[styles.normaltxt, { textAlign: 'center' }]}>{item.name}</Text>
                                <Text style={[styles.normaltxt, { textAlign: 'center', fontSize: width * 0.035, color: '#888888' }]}>{item.unit}</Text>
                            </View>
                            <View style={styles.unit}>
                                <Text style={[styles.headtxt]}>{instantValue.quantities[item.name] * item.pro} <Text style={styles.normaltxt}>มก</Text></Text>
                                <Text style={[styles.normaltxt, { textAlign: 'center', fontSize: width * 0.035, color: '#888888' }]}>(จำนวน: {instantValue.quantities[item.name]})</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.adviseContainer}>
                    <View style={styles.advise1}>
                        <Text style={[styles.normaltxt, { fontSize: width * 0.035 }]}>ปริมาณ<Text>{instantValue.thPro}</Text>ที่แนะนำต่อวัน</Text>
                        <Text style={[styles.normaltxt, { fontSize: width * 0.055 }]}>{instantValue.quotaMax} มก</Text>
                    </View>
                    <View style={styles.advise1}>
                        <Text style={[styles.normaltxt, { fontSize: width * 0.035 }]}>ปริมาณ{instantValue.thPro}ที่ท่านเลือก</Text>
                        <Text style={[styles.normaltxt, { fontSize: width * 0.055 }]}>{instantValue.cost} มก</Text>
                    </View>
                </View>
                {renderFooter()}
            </View>
            <View style={styles.containerButton}>
                <Pressable style={styles.buttry} onPress={() => props.navigation.navigate('Menu')}>
                    <Icon name='caret-left' size={40} />
                    <Text style={styles.normaltxt}>ลองใหม่</Text>
                </Pressable>
                <Pressable style={styles.butsave} onPress={() => insertData()}>
                    <Text style={styles.normaltxt}>บันทึก</Text>
                    <Icon name='caret-right' size={40} />
                </Pressable>
            </View>
        </ScrollView>
    );
}

export default Result;

const styles = StyleSheet.create({
    headtxt: {
        fontSize: width * 0.055,
        color: '#493A3B',
        fontFamily: 'Mali-SemiBold'
    },
    normaltxt: {
        fontSize: width * 0.045,
        color: '#493A3B',
        fontFamily: 'Mali-SemiBold'
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    goBack: {
        height: height * 0.07,
        justifyContent: 'center',
        paddingLeft: width * 0.04,
        // borderWidth: 1,
    },
    header: {
        backgroundColor: '#F3C1C2',
        height: height * 0.065,
        width: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        marginVertical: 16,
    },
    foodItems: {
        // borderWidth: 1,
        // backgroundColor: '#22C7A9',
        paddingBottom: 16,
        // borderRadius: 15,
    },
    box: {
        flexDirection: 'row',
        height: height * 0.15,
        backgroundColor: '#fff',
        marginTop: 16,
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    boxtxt: {
        width: width * 0.45,
    },
    img: {
        width: width * 0.3,
        height: height * 0.15,
        borderRadius: 15,
    },
    imageContainer: {
        overflow: 'hidden',
        borderRadius: 15,
    },
    footer: {
        flexDirection: 'row',
        // padding: 8,
        marginHorizontal: 8,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1
    },
    adviseContainer: {
        // borderWidth: 1,
        paddingHorizontal: 24,
        margin: 16,
        justifyContent: 'center',
        height: height * 0.13,
        borderRadius: 15,
        backgroundColor: '#FFECC1'
    },
    advise1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
        // paddingHorizontal: 24,
    },
    jibiContainer: {
        // borderWidth: 1,
        width: width * 0.45,
        position: 'relative',
        right: -20,
        top: 15,
    },
    jibi: {
        width: width * 0.45,
        height: height * 0.3,
        // transform: [{ scaleX: -1 }],
        // borderWidth: 1,
    },
    lasttxt: {
        width: width * 0.5,
        height: width * 0.33,
        // borderWidth: 1,
        borderColor: 'green',
        // borderRadius: (width * 0.53) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3C1C2'
    },
    containerButton: {
        flexDirection: 'row',
        width: width * 0.9,
        height: height * 0.08,
        justifyContent: 'space-around',
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: 16,
        // borderWidth: 1,
    },
    buttry: {
        flexDirection: 'row',
        borderWidth: 1,
        width: width * 0.4,
        height: height * 0.08,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#F3C1C2'
    },
    butsave: {
        flexDirection: 'row',
        borderWidth: 1,
        width: width * 0.4,
        height: height * 0.08,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#22C7A9'
    },
    bgImg: {
        resizeMode: 'cover',
        position: 'relative',
        top: -70,
        left: -30,
        width: width * 0.57,
        height: height * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scaleX: -1 }],
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: width * 0.8,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeBut: {
        alignSelf: 'flex-end'
    }

});
