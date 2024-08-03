import { StyleSheet, Text, View, Dimensions, Pressable, BackHandler, Image, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';

const { width, height } = Dimensions.get('window');
// const user1 = 'anakin1';

const Program0 = (props) => {
    const [program, setProgram] = useState();
    const [diffmonth, setDiffmonth] = useState();
    const { userData, userBloodResult } = props.route.params
    const userData0 = userData.username;

    console.log(userData0)

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

    useEffect(() => {
        const userProgram = selectProgram(userBloodResult);
        setProgram(userProgram);
        const date = getDate(userBloodResult);
        console.log(date)
        setDiffmonth(date);
    }, [])

    const insertData = () => {
        const userProgram = selectProgram(userBloodResult);
        const date = getDate(userBloodResult);
        const userProgramData = {
            username: userData0.username, pro: userProgram.pro, thPro: userProgram.thPro,
            fullPro: userProgram.program, quotaMin: userProgram.quotaMin, quotaMax: userProgram.quotaMax, startDate: date.startDate,
            endDate: date.endDate
        };
        props.navigation.navigate('Chart0', { userData0, userBloodResult, userProgramData })
    }



    const months = {
        1: 'ม.ค.', 2: 'ก.พ.', 3: 'มี.ค.', 4: 'เม.ย.',
        5: 'พ.ค.', 6: 'มิ.ย.', 7: 'ก.ค.', 8: 'ส.ค.', 9: 'ก.ย.', 10: 'ต.ค.', 11: 'พ.ย', 12: 'ธ.ค.'
    }
    const selectProgram = (bloodResult) => {
        let programs;
        if (bloodResult.k > 5.1) {
            if (bloodResult.k > 5.1 && bloodResult.k <= 5.5) {
                programs = { program: 'Low K Lv1', cap: 'ลดละ "K" เลเวล 1', thPro: 'โพแทสเซียม', pro: 'k', quotaMin: 0, quotaMax: 1500 };
            }
            else if (bloodResult.k > 5.5) {
                programs = { program: 'Low K Lv2', cap: 'ลดละ "K" เลเวล 2', thPro: 'โพแทสเซียม', pro: 'k', quotaMin: 0, quotaMax: 1500 };
            }
        }
        else if (bloodResult.na > 145) {
            if (bloodResult.bpUp >= 130) {
                programs = { program: 'Low Na', cap: 'ลดละ "เกลือ"', thPro: 'เกลือ', pro: 'na', quotaMin: 0, quotaMax: 2000 };
            }
            else if (bloodResult.bpUp < 130) {
                programs = { program: 'Low Na', cap: 'ลดละ "เกลือ"', thPro: 'เกลือ', pro: 'na', quotaMin: 0, quotaMax: 4000 };
            }
        }
        else if (bloodResult.po4 > 4.5) {
            if (bloodResult.eGFR > 45) {
                programs = { program: 'Low PO4', cap: 'ลดละ "ฟอส"', thPro: 'ฟอส', pro: 'po4', quotaMin: 0, quotaMax: 1000 };
            }
            else if (bloodResult.eGFR <= 45) {
                programs = { program: 'Low PO4', cap: 'ลดละ "ฟอส"', thPro: 'ฟอส', pro: 'po4', quotaMin: 0, quotaMax: 800 };
            }
        }
        else if (bloodResult.k < 3.5) {
            programs = { program: 'High K', cap: 'เพิ่มเสริม "K"', thPro: 'โพแทสเซียม', pro: 'k', quotaMin: 0, quotaMax: 2000 };
        }
        else if (bloodResult.na < 135) {
            programs = { program: 'High Na', cap: 'เพิ่มเสริม "เกลือ"', thPro: 'เกลือ', pro: 'na', quotaMin: 0, quotaMax: 2000 };
        }
        else {
            programs = { program: 'Low Na', cap: 'ลดละ "เกลือ"', thPro: 'เกลือ', pro: 'na', quotaMin: 0, quotaMax: 2000 };
        }
        return programs;
    }

    const getDate = (lastData) => {
        const startDate = moment(lastData.date, 'YYYY-MM-DD');
        const currentDate = moment();
        const endDate = startDate.add(90, 'days');
        const diffDays = currentDate.diff(startDate, 'days');

        const fullDate = {
            current: { month: months[currentDate.month() + 1], day: currentDate.date() },
            end: { month: months[endDate.month() + 1], day: endDate.date() },
            diffDays: diffDays,
            startDate: `${currentDate.year()}-${currentDate.month() + 1}-${currentDate.date()}`, endDate: `${endDate.year()}-${endDate.month() + 1}-${endDate.date()}`
        };

        return fullDate;
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flexGrow: 1, }}>
            <ScrollView style={styles.container}>
                <View style={styles.topHalf}>
                    <Image style={styles.img} source={require('./../assets/image/program.png')} />
                    <View style={styles.box1}>
                        <Text style={[styles.normaltxt, { textAlign: 'center' }]}>
                            ใน 3 เดือนนี้จอยขอเอาใจช่วยคุณ <Text style={{ color: '#D13F71' }}>{userData0.name}</Text> ค่ะ
                        </Text>
                    </View>
                </View>
                <View style={styles.botHalf}>
                    <View style={styles.circle1}></View>
                    <View style={styles.programContainer}>
                        <View style={styles.program}>
                            <Text style={styles.headtxt}>โปรแกรม</Text>
                        </View>
                        <View style={styles.course}>
                            <Text style={[styles.headtxt, { fontSize: width * 0.1 }]}>{program && program.program}</Text>
                            <Text style={[styles.normaltxt, { color: '#D13F71', marginTop: -16 }]}>{program && program.cap}</Text>
                        </View>
                        <View style={styles.date}>
                            <Text style={[styles.normaltxt, { color: 'red' }]}>{diffmonth?.current?.month} - {diffmonth?.end?.month}</Text>
                        </View>

                    </View>

                    <Pressable style={styles.button} onPress={() => insertData()}>
                        <Text style={[styles.normaltxt, { color: '#fff' }]}>ถัดไป</Text>
                        <View style={styles.circle}>
                            <Icon name='chevron-right' size={width * 0.1} color={"#000"} />
                        </View>
                    </Pressable>
                </View>
            </ScrollView >
        </KeyboardAvoidingView>
    )
}

export default Program0

const styles = StyleSheet.create({
    // scrollView: {
    //     flexGrow: 1,
    // },
    container: {
        flex: 1,
        backgroundColor: '#22C7A9',
    },
    topHalf: {
        // flex: 0.3,

        // height: height * 0.28,
        flexDirection: 'row',
        height: height * 0.35,
        justifyContent: 'space-evenly',
        alignItems: 'center',

    },
    box1: {
        width: width * 0.55,
        height: height * 0.18,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 24,
        backgroundColor: '#FFEFEF',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    img: {
        width: width * 0.35,
        height: height * 0.3
    },
    botHalf: {
        height: height * 0.65,
        // flex: 0.7,
        backgroundColor: '#D6E8E1',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    headtxt: {
        fontSize: width * 0.065,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    normaltxt: {
        fontSize: width * 0.055,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    circle1: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: (width * 0.2) / 2,
        marginRight: 16,
        marginTop: 16,
        backgroundColor: '#fff',
        position: 'relative',
        alignSelf: 'flex-end',
    },
    programContainer: {
        position: 'relative',
        paddingHorizontal: 40,
        top: -32,
        gap: 16,
    },
    program: {
        width: width * 0.38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9E69A',
        borderRadius: 15,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    course: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        height: height * 0.18,
        backgroundColor: '#9EDED0',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    date: {
        borderWidth: 1,
        borderColor: 'red',
        width: width * 0.4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: width * 0.38,
        height: height * 0.08,
        backgroundColor: '#22C7A9',
        borderRadius: (height * 0.08) / 2,
        marginRight: 16,
        marginBottom: 16,
        paddingLeft: 16,
    },
    circle: {
        width: height * 0.08,
        height: height * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: (height * 0.08) / 2,
        paddingLeft: 8,
        backgroundColor: '#FFEFEF'
    },
})
