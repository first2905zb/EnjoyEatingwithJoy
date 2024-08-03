import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './Context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
const { width, height } = Dimensions.get('window')

const Chart0 = (props) => {
    // const [items, setItems] = useState([]);
    const [lastItems, setLastItems] = useState();
    const { signIn } = useContext(AuthContext);
    const [check, setCheck] = useState();
    const [bloodMonth, setBloodMonth] = useState();
    const [isInserting, setIsInserting] = useState();
    const { userData0, userBloodResult, userProgramData } = props.route.params;
    // console.log(userProgramData)
    const userEnpoint = 'https://takoyakist1-first.com/health/user';
    const bloodResultEnpoint = 'https://takoyakist1-first.com/health/bloodresult';
    const userProgramEnpoint = 'https://takoyakist1-first.com/health/userprogram';
    const consumefoodEnpoint = 'https://takoyakist1-first.com/health/consumefood';
    const months = [
        'มกราคม', 'กุมภาพัน', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'
    ]
    console.log(userProgramData.endDate)
    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);
    const insertData = async (userEnpoint, bloodResultEnpoint, userProgramEnpoint, consumefoodEnpoint) => {
        if (isInserting) return; // ถ้ากำลังทำงานอยู่, ไม่ทำงานซ้ำซ้อน
        setIsInserting(true); // เริ่มการทำงาน, ตั้งค่าสถานะเป็น true

        try {
            await fetch(userEnpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userData0.name,
                    username: userData0.username,
                    password: userData0.password,
                    age: userData0.age,
                    sex: userData0.sex
                }),
            })
                .then(res => res.json())
                .then(data => { console.log('Insert user success: ', data) })
                .catch((error) => console.log('Error user:', error));

            await fetch(bloodResultEnpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData0.username,
                    eGFR: userBloodResult.eGFR,
                    height: userBloodResult.height,
                    weight: userBloodResult.weight,
                    bpUp: userBloodResult.bpUp,
                    bpDown: userBloodResult.bpDown,
                    alb: userBloodResult.alb,
                    na: userBloodResult.na,
                    k: userBloodResult.k,
                    po4: userBloodResult.po4,
                    urine: userBloodResult.urine,
                    date: userBloodResult.date,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success bloodResult:', data);
                })
                .catch((error) => {
                    console.error('Error bloodResult:', error);
                });

            await fetch(userProgramEnpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData0.username,
                    pro: userProgramData.pro,
                    thPro: userProgramData.thPro,
                    fullPro: userProgramData.fullPro,
                    quotaMin: userProgramData.quotaMin,
                    quotaMax: userProgramData.quotaMax,
                    startDate: userProgramData.startDate,
                    endDate: userProgramData.endDate,
                }),
            })
                .then(response1 => response1.json())
                .then(data1 => {
                    console.log('Success pro:', data1);
                })
                .catch((error1) => {
                    console.error('Error pro:', error1);
                });

            await fetch(consumefoodEnpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData0.username,
                    cost: 0,
                    date: `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`
                }),
            })
                .then(response2 => response2.json())
                .then(data2 => {
                    console.log('Success con:', data2);
                })
                .catch((error2) => {
                    console.error('Error con:', error2);
                });

            await signIn(userData0.username);

        } catch (error) {
            console.error('Insertion failed:', error);
        } finally {
            setIsInserting(false);
        }
    };

    useEffect(() => {
        // if (items.length > 0) {
        const last = userBloodResult;
        setLastItems(last);
        setCheck(checkLevels(last.eGFR, last.na, last.k, last.po4, last.bpUp, last.bpDown, last.alb))
        setBloodMonth(moment(last.date).month())
        // }
    }, [])

    function checkLevels(eGFR, Na, K, PO4, BP_sys, BP_dia, Alb) {
        let result = {};
        // eGFR
        if (eGFR < 90) {
            result.eGFR = { level: "ต่ำ", color: "#D13F71" }; // อันตรายมาก
        } else {
            result.eGFR = { level: "ปกติ", color: "green" }; // ปกติ
        }
        // Na
        if (Na < 135) {
            result.Na = { level: "ต่ำ", color: "#D13F71" }; // อันตรายมาก
        } else if (Na <= 145) {
            result.Na = { level: "ปกติ", color: "green" }; // ปกติ
        } else {
            result.Na = { level: "สูง", color: "#D13F71" }; // อันตรายมาก
        }
        // K
        if (K < 3.5) {
            result.K = { level: "ต่ำ", color: "#D13F71" }; // อันตรายมาก
        } else if (K < 5.1) {
            result.K = { level: "ปกติ", color: "green" }; // ปกติ
        } else {
            result.K = { level: "สูง", color: "#D13F71" }; // อันตรายมาก
        }
        // PO4
        if (PO4 < 2.5) {
            result.PO4 = { level: "ต่ำ", color: "#D13F71" }; // อันตรายมาก
        } else if (PO4 <= 4.5) {
            result.PO4 = { level: "ปกติ", color: "green" }; // ปกติ
        } else {
            result.PO4 = { level: "สูง", color: "#D13F71" }; // อันตรายมาก
        }

        if (BP_sys < 90) {
            result.BP = { level: "ต่ำ", color: '#D13F71' };
        } else if (BP_sys < 130 && BP_dia <= 90)
            result.BP = { level: "ปกติ", color: 'green' };
        else {
            result.BP = { level: "สูง", color: '#D13F71' };
        }

        // Alb
        if (Alb < 3.4) {
            result.Alb = { level: "ต่ำ", color: "#D13F71" }; // อันตรายมาก
        } else if (Alb <= 5.4) {
            result.Alb = { level: "ปกติ", color: "green" }; // ปกติ
        } else {
            result.Alb = { level: "สูง", color: "#D13F71" }; // อันตรายมาก
        }
        return result;
    }
    // console.log("hello")
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headtxt}>สรุปผล: <Text style={{ color: '#D13F71' }}>{months[bloodMonth]}</Text></Text>
            </View>
            <View style={styles.contentCon}>
                <View style={styles.group}>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>น้ำหนัก</Text>
                        <Text style={styles.headtxt}>{userBloodResult.weight}</Text>
                        <Text style={[styles.normaltxt, { position: 'absolute', bottom: 1 }]}>กิโลกรัม</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>ส่วนสูง</Text>
                        <Text style={styles.headtxt}>{userBloodResult.height}</Text>
                        <Text style={[styles.normaltxt, { position: 'absolute', bottom: 1 }]}>เซนติเมตร</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>eGFR</Text>
                        <Text style={[styles.normaltxt, { position: 'absolute', bottom: 0., textAlign: 'center' }]}>1.73 m²</Text>
                        <Text style={[styles.headtxt, { color: check && check.eGFR.color }]}>{check && check.eGFR.level}</Text>
                        <Text style={[styles.normaltxt, { color: check && check.eGFR.color, position: 'absolute', bottom: 15, textAlign: 'center' }]}>{lastItems && lastItems.eGFR} <Text style={{ color: '#493A3B' }}>mL/min/</Text></Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>Na</Text>
                        <Text style={[styles.headtxt, { color: check && check.Na.color }]}>{check && check.Na.level}</Text>
                        <Text style={[styles.normaltxt, { color: check && check.Na.color, position: 'absolute', bottom: 1 }]}>{lastItems && lastItems.na} <Text style={{ color: '#493A3B' }}>mmol/L</Text></Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>K</Text>
                        <Text style={[styles.headtxt, { color: check && check.K.color }]}>{check && check.K.level}</Text>
                        <Text style={[styles.normaltxt, { color: check && check.K.color, position: 'absolute', bottom: 1 }]}>{lastItems && lastItems.k} <Text style={{ color: '#493A3B' }}>mmol/L</Text></Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>PO4</Text>
                        <Text style={[styles.headtxt, { color: check && check.PO4.color }]}>{check && check.PO4.level}</Text>
                        <Text style={[styles.normaltxt, { color: check && check.PO4.color, position: 'absolute', bottom: 1 }]}>{lastItems && lastItems.po4} <Text style={{ color: '#493A3B' }}>mmol/L</Text></Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>BP</Text>
                        <Text style={[styles.headtxt, { color: check && check.BP.color }]}>{check && check.BP.level}</Text>
                        <Text style={[styles.normaltxt, { color: check && check.BP.color, position: 'absolute', bottom: 1 }]}>{lastItems && lastItems.bpUp}/{lastItems && lastItems.bpDown} <Text style={{ color: '#493A3B' }}>mmHg</Text></Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>Alb</Text>
                        <Text style={[styles.headtxt, { color: check && check.Alb.color }]}>{check && check.Alb.level}</Text>
                        <Text style={[styles.normaltxt, { color: check && check.Alb.color, position: 'absolute', bottom: 1 }]}>{lastItems && lastItems.alb} <Text style={{ color: '#493A3B' }}>g/dL</Text></Text>
                    </View>
                </View>
            </View>
            <Pressable style={styles.button} onPress={() => insertData(userEnpoint, bloodResultEnpoint, userProgramEnpoint, consumefoodEnpoint)} >
                <Text style={[styles.normaltxt, { color: '#493A3B' }]}>ถัดไป</Text>
                <View style={styles.circle}>
                    <Icon name='chevron-right' size={width * 0.1} color={"#000"} />
                </View>
            </Pressable>
        </View >
    )
}

export default Chart0

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        padding: 16,
        paddingVertical: 24,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        paddingHorizontal: 16,
        backgroundColor: '#F3C1C2',
        width: width * 0.7,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    contentCon: {
        marginVertical: 16,
        padding: 16,
        height: height * 0.75,
        gap: 32,
    },
    group: {
        flexDirection: 'row',
        gap: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        flex: 1,
        height: height * 0.146,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
        borderRadius: 15,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: width * 0.38,
        height: height * 0.08,
        backgroundColor: '#F3C1C2',
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
