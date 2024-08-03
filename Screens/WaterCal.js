import { Dimensions, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Pressable, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AuthContext } from './Context'
import Orientation from 'react-native-orientation-locker'

const { width, height } = Dimensions.get('window')

const WaterCal = (props) => {
    const [maxWater, setMaxWater] = useState(0);
    const [water, setWater] = useState(null);
    const [data, setData] = useState([]);
    const [lastData, setLastData] = useState();
    const { username } = useContext(AuthContext)
    const bloodResultEnpoint = 'https://takoyakist1-first.com/health/bloodresult'
    // const user1 = 'anakin1';
    console.log(maxWater)
    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);
    useEffect(() => {
        if (water) {
            const max = parseInt(water) + 500;
            setMaxWater(max);
        }
    }, [water])

    useEffect(() => {
        fetch(bloodResultEnpoint)
            .then(res => res.json())
            .then((result) => {
                setData(result)
            })
            .catch(err => console.log("Error fetch result data:", err))
    }, [])

    const getLastData = (data) => {
        const last = data.filter(user => user.username === username);
        return last[last.length - 1];
    };

    useEffect(() => {
        if (data.length > 0) {
            const lastDatas = getLastData(data);
            setLastData(lastDatas);
        }
    }, [data]);

    console.log(lastData)

    const insertData = async () => {
        if (water !== null) {
            await fetch(bloodResultEnpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    eGFR: lastData.eGFR,
                    height: lastData.height,
                    weight: lastData.weight,
                    bpUp: lastData.bpUp,
                    bpDown: lastData.bpDown,
                    alb: lastData.alb,
                    na: lastData.na,
                    k: lastData.k,
                    po4: lastData.po4,
                    urine: maxWater,
                    date: lastData.date,
                }),
            })
                .then(respone => respone.json())
                .then(data => {
                    console.log('Sucess:', data);
                })
                .catch((error) => {
                    console.error('Error', error)
                })
            await props.navigation.goBack()
        }
        else {
            Alert.alert('ลืมอะไรบางอย่าง', 'โปรดกรอกปริมาณปัจสาวะ')
        }
    }
    return (
        <KeyboardAwareScrollView>

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Icon name='chevron-left' size={25} color={'black'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.topic}>
                    <Text style={styles.headtxt}>คำนวณปริมาณน้ำดื่ม</Text>
                </View>
                <View style={styles.circle1}></View>
                <View style={styles.inputContainer}>
                    <Text style={styles.normaltxt}>ปริมาณปัสสาวะ 24 ชั่วโมงที่ผ่านมา</Text>
                    <TextInput
                        style={[styles.headtxt, { color: '#000', flex: 1, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }]}
                        placeholder='กรุณากรอกข้อมูล'
                        value={water}
                        // onChange={() => setWater()}
                        onChangeText={setWater}
                        keyboardType='numeric'
                        autoCorrect={false}
                        placeholderTextColor={'#000'}
                        maxLength={4}
                    />
                </View>
                <View style={[styles.inputContainer, { backgroundColor: '#fff' }]}>
                    <Text style={styles.normaltxt}>ปริมาณน้ำที่สามารถดื่มได้วันนี้</Text>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.headtxt}>{maxWater} มล.</Text>
                    </View>
                </View>
                <View style={styles.circle2}></View>
                {/* <View> */}
                <Image style={styles.img} source={require('./../assets/image/happy.png')} />
                <View style={styles.circle3}></View>
                <Pressable style={styles.button} onPress={() => insertData()}>
                    <Text style={styles.normaltxt}>ถัดไป</Text>
                    <View style={styles.circle}>
                        <Icon name='chevron-right' size={width * 0.1} color={"#000"} />
                    </View>
                </Pressable>
                {/* </View> */}
            </View>
        </KeyboardAwareScrollView>
    )
}

export default WaterCal

const styles = StyleSheet.create({
    headtxt: {
        fontSize: width * 0.065,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    normaltxt: {
        fontSize: width * 0.04,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    container: {
        backgroundColor: '#22C7A9',
        flex: 1,
    },
    header: {
        // flex: 0.1,
        backgroundColor: '#22C7A9',
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 24
    },
    topic: {
        backgroundColor: '#D7EFE6',
        width: width * 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    circle1: {
        width: width * 0.23,
        height: width * 0.23,
        borderRadius: (width * 0.23) / 2,
        // borderWidth: 1,
        position: 'absolute',
        right: -10,
        top: height * 0.1,
        backgroundColor: '#F3F3F3',
        zIndex: -1,
    },
    inputContainer: {
        // borderWidth: 1,
        marginTop: height * 0.05,
        // marginBottom: 16,
        backgroundColor: '#F3C1C2',
        borderRadius: 15,
        width: width * 0.9,
        height: height * 0.2,

        alignSelf: 'center',
        padding: 16,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    circle2: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        // borderWidth: 1,
        position: 'absolute',
        // right: -10,
        left: -20,
        top: height * 0.5,
        backgroundColor: '#F3F3F3',
        zIndex: -1,
    },
    img: {
        width: width * 0.4,
        height: height * 0.3,
        alignSelf: 'center'
    },
    circle3: {
        width: width * 0.23,
        height: width * 0.23,
        borderRadius: (width * 0.23) / 2,
        position: 'absolute',
        right: width * 0.1,
        top: height * 0.8,
        backgroundColor: '#F3F3F3',
        zIndex: -1,
    },
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: width * 0.38,
        height: height * 0.08,
        backgroundColor: '#D7EFE6',
        borderRadius: (height * 0.08) / 2,
        marginRight: 16,
        marginBottom: 16,
        paddingLeft: 16,
        borderWidth: 1,
        borderColor: '#22C7A9',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
})