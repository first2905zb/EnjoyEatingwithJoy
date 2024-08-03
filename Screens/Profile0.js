import { Dimensions, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, ScrollView, Alert, BackHandler } from 'react-native'
import { TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback, useContext } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';
import { AuthContext } from './Context';
import moment from 'moment';
// import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')
const months = {
    1: 'มกราคม', 2: 'กุมภาพัน', 3: 'มีนาคม', 4: 'เมษายน',
    5: 'พฤษภาคม', 6: 'มิถุนายน', 7: 'กรกฎาคม', 8: 'สิงหาคม', 9: 'กันยายน', 10: 'ตุลาคม', 11: 'พฤษจิกายน', 12: 'ธันวาคม'
}

import { useNavigation } from '@react-navigation/native';

const Profile0 = (props) => {
    const navigation = useNavigation(); // ใช้ useNavigation จาก react-navigation
    const [weight, setWeight] = useState(null);
    const [height, setHeight] = useState(null);
    const [eGFR, seteGFR] = useState(null);
    const [Na, setNa] = useState(null);
    const [K, setK] = useState(null);
    const [PO4, setPO4] = useState(null);
    const [BPUp, setBPUp] = useState(null);
    const [BPDown, setBPDown] = useState(null);
    const [Alb, setAlb] = useState(null);
    const [urine, setUrine] = useState(null);
    var month = moment().month() + 1;
    const { username, } = useContext(AuthContext)
    // console.log(month)
    const userData = props.route.params

    console.log(userData)
    useEffect(() => {

        Orientation.lockToPortrait();
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => {
            Orientation.unlockAllOrientations();
            backHandler.remove();
        };
    }, []);
    const insertData = (date) => {
        const userBloodResult = {
            eGFR: eGFR, height: height, weight: weight, bpUp: BPUp, bpDown: BPDown
            , alb: Alb, na: Na, k: K, po4: PO4, urine: parseFloat(urine) + 500, date: date
        }
        props.navigation.navigate('Program0', { userBloodResult, userData })
    }

    const save = () => {
        if (eGFR !== null && height !== null && weight !== null &&
            Na !== null && K !== null && PO4 !== null && BPUp !== null && BPDown !== null &&
            Alb !== null && urine !== null) {
            insertData(getCurrentDate());
        }
        else {
            Alert.alert('โปรดกรอกข้อมูลให้ครบ')
        }
    }
    const getCurrentDate = () => {
        var date = new Date().getDate();
        var montht = moment().format('MM')
        var year = new Date().getFullYear();
        return year + '-' + montht + '-' + date;//format: d-m-y;
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flexGrow: 1, }}>
            <ScrollView contentContainerStyle={styles.container} >
                <View style={styles.header}>
                </View>
                <View style={styles.topic}>
                    <Text style={styles.headtxt}>ผลเลือดเดือน: <Text style={[styles.headtxt, { color: "#D13F71" }]}>{months[month]}</Text></Text>
                </View>
                <View style={styles.dataList}>
                    <View style={styles.containerGroup}>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>น้ำหนัก</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#F9E8B2" }]}
                                onChangeText={setWeight}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>ส่วนสูง</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#E6FFE9" }]}
                                onChangeText={setHeight}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                    </View>
                    <View style={styles.containerGroup}>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>eGFR</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#CFF1F0" }]}
                                onChangeText={seteGFR}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>Na(โซเดียม)</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#F4D0EA" }]}
                                onChangeText={setNa}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                    </View>
                    <View style={styles.containerGroup}>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>K(โพแทสเซียม)</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#DFEDB8" }]}
                                onChangeText={setK}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>PO4(ฟอสฟอรัส)</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#89D4FF" }]}
                                onChangeText={setPO4}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                    </View>
                    <View style={styles.containerGroup}>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>BP(ความดัน)</Text>
                            <View style={{ flexDirection: 'row', backgroundColor: "#F8BBD0", borderRadius: 15, width: 130, justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <TextInput
                                    style={{ color: '#000', borderWidth: 0.5, flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRadius: 10, borderColor: '#D13F71' }}
                                    onChangeText={setBPUp}
                                    keyboardType='numeric'
                                    maxLength={4}
                                />
                                <Text style={styles.normaltxt}>/</Text>
                                <TextInput
                                    style={{ color: '#000', borderWidth: 0.5, flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderRadius: 10, borderColor: '#D13F71' }}
                                    onChangeText={setBPDown}
                                    keyboardType='numeric'
                                    maxLength={4}
                                />
                            </View>
                        </View>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>Alb(โปรตีน)</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#FFF68F" }]}
                                onChangeText={setAlb}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                    </View>
                    <View style={styles.containerGroup}>
                        <View style={styles.group}>
                            <Text style={styles.normaltxt}>ปริมาณปัสสาวะ(ต่อ 1 วัน)</Text>
                            <TextInput
                                style={[styles.in, { backgroundColor: "#98FF98", width: 260 }]}
                                onChangeText={setUrine}
                                keyboardType='numeric'
                                maxLength={4}
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.save} onPress={() => save()}>
                    <Text style={[styles.headtxt, { color: "#fff" }]}>บันทึก</Text>
                </TouchableOpacity>
            </ScrollView >
        </KeyboardAvoidingView>
    )
}

export default Profile0

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
    },
    topic: {
        // flex: 0.08,
        backgroundColor: '#F3C1C2',
        // width: 340,
        width: width * 0.8,
        // height: 500,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
    headtxt: {
        fontSize: width * 0.065,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    normaltxt: {
        fontSize: width * 0.045,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    dataList: {
        // flex: 0.7,
        // justifyContent: 'space-evenly',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
        marginTop: 16,
        width: width * 0.8,
        // borderWidth: 1,
        alignSelf: 'center'
        // height: height * 0.7
        // alignItems: 'f'
    },
    containerGroup: {
        flexDirection: 'row',
        width: width * 0.8,
        justifyContent: 'space-evenly'
    },
    group: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    in: {
        // borderWidth: 1,
        width: 130,
        borderRadius: 15,
        // paddingLeft: 24,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#000',
    },
    save: {
        // flex: 0.1,
        width: 320,
        // height: 60,
        backgroundColor: '#22C7A9',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 30,
        marginBottom: 16,
    },
    header: {
        // flex: 0.1,
        backgroundColor: '#22C7A9',
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 24
    }
})