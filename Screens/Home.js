import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import { BackgroundImage } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from './Context';
const { width, height } = Dimensions.get('window');

const Home = (props) => {
    const [items, setItems] = useState([]);
    const [diffDate, setDiffDate] = useState();
    const [program1, setProgram1] = useState([]);
    const [lastData, setLastData] = useState();
    const [maxWater, setMaxWater] = useState();
    const { username, signOut, signIn } = useContext(AuthContext);
    const [con, setCon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cost1, setCost1] = useState();
    const bloodResultEnpoint = 'https://takoyakist1-first.com/health/bloodresult';
    const uesrProgramEnpoint = 'https://takoyakist1-first.com/health/userprogram';
    const consumefoodEnpoint = 'https://takoyakist1-first.com/health/consumefood';

    useFocusEffect(
        useCallback(() => {
            try {
                fetchData(bloodResultEnpoint, setItems);
                fetchData(uesrProgramEnpoint, setProgram1);
                fetchData(consumefoodEnpoint, setCon);
                setIsLoading(false);
            } catch (error) {
                console.log(error)
                setIsLoading(false);
                Alert.alert('Error: ดึงข้อมูลผิดพลาด')
            }
        }, [])
    )
    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    useEffect(() => {
        try {
            fetchData(bloodResultEnpoint, setItems);
            fetchData(uesrProgramEnpoint, setProgram1);
            fetchData(consumefoodEnpoint, setCon);
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            setIsLoading(false);
            Alert.alert('Error: ดึงข้อมูลผิดพลาด')
        }
    }, []);

    // console.log(con)    

    useEffect(() => {
        // signOut()
        if (program1.length > 0 && con.length > 0) {
            const lastDatas = getLastData(program1);
            const targetDate = getDate(lastDatas.startDate);
            const lastDataCon = getLastData(con);
            const cost = lastDatas.quotaMax - lastDataCon.cost;
            setCost1(cost)
            setLastData(lastDatas)
            setDiffDate(targetDate)
        }
    }, [program1, con]);

    useEffect(() => {
        if (items.length > 0) {
            const lastDatas = getLastData(items);
            setMaxWater(lastDatas.urine)
        }
    }, [items]);

    // useEffect(() => {
    //     if (con.length > 0) {
    //         const lastData = getLastData(con);
    //         setCost(lastData.cost);
    //     }
    // }, [con])
    // useEffect(() => {
    //     if (con.length > 0) {
    //         const lastDatas = getLastData(con);
    //         setLastCon(lastDatas.date)
    //         if (moment().diff(moment(lastDatas.date, 'YYYY-MM-DD'), 'days') >= 1) {
    //             insertData();
    //             console.log('Insert complete.')
    //         }
    //         else console.log('Insert notcomplete')
    //     }
    // }, [con]);

    const fetchData = async (enpoint, setData) => {
        try {
            const res = await fetch(enpoint)
            const result = await res.json();
            setData(result)
        } catch (error) {
            console.log('error', error)
        }
    }

    const getLastData = (data) => {
        const last = data.filter(user => user.username === username);
        return last[last.length - 1];
    }

    const getDate = (lastData) => {
        const startDate = moment(lastData, 'YYYY-MM-DD');
        const currentDate = moment();
        const diffDays = currentDate.diff(startDate, 'days');

        return diffDays;
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.topHalf}>
                <View style={styles.circle1}></View>
                <View style={styles.pro}>
                    {/* <Image style={styles.imgC} source={require('./../assets/image/Pcc1.png')} /> */}
                    <Text style={styles.headtxt}>โปรแกรม </Text>
                    <Text style={[styles.highlightxt, { fontFamily: 'Mali-SemiBold' }]}>{lastData && lastData.fullPro}</Text>
                </View>
                <View style={styles.day}>
                    <Text style={styles.headtxt}>Day </Text>
                    <Text style={styles.headtxt}>{diffDate} / 90</Text>
                </View>
                <View style={styles.firstContent}>
                    <Text style={[styles.normaltxt, { marginBottom: -16 }]}>ปริมาณ<Text style={{ color: '#D13F71' }}>{lastData && lastData.thPro}</Text>ที่ทานได้ / วัน</Text>
                    <Text style={[styles.headtxt, { fontSize: 60 }]}>{cost1}</Text>
                    <Text style={[styles.normaltxt, { alignSelf: 'flex-end', marginRight: 16, marginTop: -48 }]}>มก / วัน</Text>
                    <TouchableOpacity style={styles.cFoods} onPress={() => props.navigation.navigate('Menu')}>
                        <Text style={[styles.normaltxt, { marginLeft: 16 }]}>เลือกอาหารที่เหมาะสม</Text>
                        <View style={styles.circle}>
                            <Icon name='chevron-right' size={30} color={'#000'} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.botHalf}>
                <View style={styles.secondContent}>
                    <View style={{ position: 'relative', top: 40, }}>
                        <Text style={[styles.normaltxt, { color: '#F3F3F3', marginBottom: -16 }]}>ปริมาณน้ำที่ดื่มได้</Text>
                        <Text style={[styles.headtxt, { fontSize: 60, color: '#F3F3F3', alignSelf: 'center' }]}>{maxWater}</Text>
                        <Text style={[styles.normaltxt, { color: '#F3F3F3', position: 'relative', top: -55, right: -160 }]}>มล / วัน</Text>
                    </View>
                    {/* <Image style={{ height: height * 0.05, width: width * 0.9 }} source={{ uri: 'https://t3.ftcdn.net/jpg/05/64/78/72/360_F_564787273_hN9mDW6Tn5VPbIBf5fOPQPa48IqqtQCR.png' }} /> */}
                    <BackgroundImage style={{ height: height * 0.17, width: width * 0.9, justifyContent: 'center', alignItems: 'center' }} source={{ uri: 'https://t3.ftcdn.net/jpg/05/64/78/72/360_F_564787273_hN9mDW6Tn5VPbIBf5fOPQPa48IqqtQCR.png' }} >
                        <TouchableOpacity style={styles.calWater} onPress={() => props.navigation.navigate('WaterCal')}>
                            <Text style={[styles.normaltxt, { marginLeft: 16 }]}>คำนวณปริมาณน้ำดื่ม  </Text>
                            <View style={[styles.circle, { backgroundColor: '#fff' }]}>
                                <Icon name='chevron-right' size={30} color={'#000'} />
                            </View>
                        </TouchableOpacity>
                    </BackgroundImage>
                </View>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#22C7A9',
        // margin: 0,
        // padding: 0,
    },
    circle1: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: (width * 0.1) / 2,
        // marginTop: ,
        marginLeft: 16,
        backgroundColor: '#fff'
    },
    topHalf: {
        flex: 0.6,
        backgroundColor: '#D6E8E1',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        // paddingHorizontal: 16,
        paddingVertical: 16
    },
    pro: {
        // flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        // width: width * 0.75,
        height: height * 0.07,
        backgroundColor: '#FFCECE',
        borderTopLeftRadius: 35,
        borderBottomLeftRadius: 35,
        paddingHorizontal: 16,
    },
    headtxt: {
        fontSize: width * 0.065,
        color: '#493A3B',
        fontFamily: 'Mali-SemiBold'
    },
    normaltxt: {
        fontSize: width * 0.045,
        color: '#493A3B',
        fontFamily: 'Mali-SemiBold'
    },
    highlightxt: {
        fontSize: width * 0.07,
        color: '#D13F71'
    },
    day: {
        // flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: width * 0.45,
        height: height * 0.07,
        backgroundColor: '#FFEFEF',
        borderTopLeftRadius: 35,
        borderBottomLeftRadius: 35,
        marginTop: 8
    },
    firstContent: {
        // flex: 0.5,
        marginHorizontal: 16,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 3,
        borderRadius: 35,
        borderColor: '#fff',
        marginTop: 16,
        width: width * 0.9,
        height: height * 0.3
    },
    cFoods: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.88,
        height: height * 0.07,
        borderRadius: 35,
        backgroundColor: '#22C7A9'
    },
    circle: {
        width: height * 0.07,
        height: height * 0.07,
        backgroundColor: '#fff',
        borderRadius: (height * 0.08) / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botHalf: {
        flex: 0.4,
        backgroundColor: '#22C7A9'
    },
    secondContent: {
        marginHorizontal: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 3,
        borderRadius: 35,
        borderColor: 'black',
        width: width * 0.9,
        height: height * 0.3,
        marginTop: 16,
        overflow: 'hidden'
    },
    calWater: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.88,
        height: height * 0.07,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#F3F3F3',
        position: 'relative',
        bottom: -10
    },
    imgC: {
        width: width * 0.45,
        height: height * 0.21,
        position: 'absolute',
        left: -170,
        top: -5,
        transform: [{ scaleX: -1 }]
    }
});
