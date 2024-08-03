import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './Context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
const { width, height } = Dimensions.get('window')

const Chart = (props) => {
    const [items, setItems] = useState([]);
    const [lastItems, setLastItems] = useState();
    const { username } = useContext(AuthContext);
    const [check, setCheck] = useState();
    const [bloodMonth, setBloodMonth] = useState();
    const months = [
        'มกราคม', 'กุมภาพัน', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'
    ]
    const bloodResultEnpoint = 'https://takoyakist1-first.com/health/bloodresult';
    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);
    useEffect(() => {
        fetch(bloodResultEnpoint)
            .then(res => res.json())
            .then((result) => {
                setItems(result);
            });
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            const last = getLastData(items);
            setLastItems(last);
            setCheck(checkLevels(last.eGFR, last.na, last.k, last.po4, last.bpUp, last.bpDown, last.alb))
            setBloodMonth(moment(last.date).month())
        }
    }, [items])

    // console.log(bloodMonth);

    const getLastData = (data) => {
        const last = data.filter(user => user.username === username);
        return last[last.length - 1];
    }

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headtxt}>สรุปผล: <Text style={{ color: '#D13F71' }}>{months[bloodMonth]}</Text></Text>
            </View>
            <View style={styles.contentCon}>
                <View style={styles.group}>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>น้ำหนัก</Text>
                        <Text style={styles.headtxt}>{lastItems && lastItems.weight}</Text>
                        <Text style={[styles.normaltxt, { position: 'absolute', bottom: 1 }]}>กิโลกรัม</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>ส่วนสูง</Text>
                        <Text style={styles.headtxt}>{lastItems && lastItems.height}</Text>
                        <Text style={[styles.normaltxt, { position: 'absolute', bottom: 1 }]}>เซนติเมตร</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <View style={styles.box}>
                        <Text style={[styles.normaltxt, { position: 'absolute', top: 1 }]}>eGFR</Text>
                        <Text style={[styles.headtxt, { color: check && check.eGFR.color }]}>{check && check.eGFR.level}</Text>
                        <Text style={[styles.normaltxt, { color: check && check.eGFR.color, position: 'absolute', bottom: 15, textAlign: 'center' }]}>{lastItems && lastItems.eGFR} <Text style={{ color: '#493A3B' }}>mL/min/</Text></Text>
                        {/* <Text style={[styles.normaltxt, { position: 'absolute', bottom: 10, right: 45, fontSize: width * 0.025 }]}>2</Text> */}
                        <Text style={[styles.normaltxt, { position: 'absolute', bottom: 0., textAlign: 'center' }]}>1.73 m²</Text>
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
            <Pressable style={styles.button} onPress={() => props.navigation.navigate('StackHome')}>
                <Text style={[styles.normaltxt, { color: '#493A3B' }]}>ถัดไป</Text>
                <View style={styles.circle}>
                    <Icon name='chevron-right' size={width * 0.1} color={"#000"} />
                </View>
            </Pressable>
        </View>
    )
}

export default Chart

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
