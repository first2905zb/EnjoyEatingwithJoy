import { Dimensions, StyleSheet, Text, TextInput, View, Pressable, Image, Alert, ActivityIndicator, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { CheckBox } from '@rneui/base'
import Icon from 'react-native-vector-icons/FontAwesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Orientation from 'react-native-orientation-locker'
import CryptoJS from 'crypto-js';
const { width, height } = Dimensions.get('window')

const Register = (props) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [hideConPass, setHideConPass] = useState(true);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const url = 'https://takoyakist1-first.com/health/user';
    // const [userData, setUserData] = useState();

    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);
    useEffect(() => {
        fetchData(url);
    }, [])

    const fetchData = async (url) => {
        try {
            const res = await fetch(url);
            const result = await res.json();
            setData(result);
            setIsLoading(false);
        } catch (error) {
            setError(true)
            setIsLoading(false);
        }
    };

    const insertData = () => {
        const hashPassword = CryptoJS.SHA256(password).toString();
        const userData = { name: name, username: username, password: hashPassword, sex: index ? 'Femal' : 'Male', age: age }
        props.navigation.navigate('Complete', userData);
    }

    const validatePassword = (password) => {
        const minLenth = 6;
        return password.length >= minLenth;
    }

    const checkDupUser = (username) => {
        return data.some(item => item.username === username);
    }

    const handleSignUp = async () => {
        if (name !== '' && username !== '' && password !== '' && age !== '' && index !== '') {
            if (!checkDupUser(username)) {
                if (password === confirmPassword) {
                    if (!isNaN(age)) {
                        if (validatePassword(password)) {
                            insertData();
                            // props.navigation.navigate('Complete', { username })
                        }
                        else {
                            Alert.alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
                        }
                    } else {
                        Alert.alert('อายุควรจะเป็นตัวเลข')
                    }
                }
                else {
                    Alert.alert('รหัสผ่านไม่ตรงกัน')
                }
            }
            else
                Alert.alert('Username นี้เคยถูกใช้งานแล้ว');
        }
        else
            Alert.alert('โปรดกรอกข้อมูลให้ครบ')
    }



    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    if (error) {
        Alert.alert('การดาวโหลดข้อมูลผิดพลาด: ', error)
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ width: width, height: height * 0.33, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circle}></View>
                <View style={styles.circle1}></View>
                <View style={styles.circle2}></View>
                <Image style={styles.img} source={{ uri: 'https://images.ctfassets.net/grb5fvwhwnyo/1sJpRsfp1RJI3AASMiOS1h/d5cca0a1c5d78df3052659f2b56a1225/SEO-Food-Fresh-Groceries.png' }} />
            </View>
            <View style={styles.inputForm}>
                <View style={styles.in}>
                    <View style={styles.conIcon}>
                        <Icon name='id-card-o' size={30} color={'#22C7A9'} />
                    </View>
                    <TextInput
                        placeholder='ชื่อ-สกุล'
                        style={styles.headtxt}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize='none'
                        placeholderTextColor="#000"
                        autoCorrect={false}
                    />
                </View>
                <View style={styles.in}>
                    <View style={styles.conIcon}>
                        <Icon name='user' size={30} color={'#22C7A9'} />
                    </View>
                    <TextInput
                        placeholder='ชื่อบัญชีผู้ใช้'
                        style={styles.headtxt}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize='none'
                        placeholderTextColor="#000"
                        autoCorrect={false}
                    />
                </View>
                <View style={styles.in}>
                    <View style={styles.conIcon}>
                        <Icon name='lock' size={30} color={'#22C7A9'} />
                    </View>
                    <TextInput
                        placeholder='รหัสผ่าน'
                        style={styles.headtxt}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={hidePass ? true : false}
                        autoCapitalize='none'
                        placeholderTextColor="#000"
                        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setHidePass(!hidePass)} style={styles.eyeIcon}>
                        <Icon name={hidePass ? 'eye-slash' : 'eye'} size={20} color={'#22C7A9'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.in}>
                    <View style={styles.conIcon}>
                        <Icon name='check' size={30} color={'#22C7A9'} />
                    </View>
                    <TextInput
                        placeholder='ยืนยันรหัสผ่าน'
                        style={styles.headtxt}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={hideConPass ? true : false}
                        autoCapitalize='none'
                        placeholderTextColor="#000"
                        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={() => setHideConPass(!hideConPass)} style={styles.eyeIcon}>
                        <Icon name={hideConPass ? 'eye-slash' : 'eye'} size={20} color={'#22C7A9'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.in}>
                    <View style={styles.conIcon}>
                        <Icon name='calendar' size={30} color={'#22C7A9'} />
                    </View>
                    <TextInput
                        placeholder='อายุ'
                        style={styles.headtxt}
                        value={age}
                        onChangeText={setAge}
                        keyboardType='numeric'
                        autoCapitalize='none'
                        placeholderTextColor="#000"
                        autoCorrect={false}
                        maxLength={2}
                    />
                </View>
                <View style={styles.checkbox}>
                    <CheckBox
                        checked={index === 0}
                        onPress={() => setIndex(0)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title='ชาย'
                        containerStyle={{ borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                        iconRight
                        checkedColor='#22C7A9'
                        uncheckedColor='#22C7A9'
                        textStyle={styles.head}
                    />
                    <CheckBox
                        checked={index === 1}
                        onPress={() => setIndex(1)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title='หญิง'
                        containerStyle={{ borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                        iconRight
                        checkedColor='#22C7A9'
                        uncheckedColor='#22C7A9'
                        textStyle={styles.checkboxText}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.conBut} onPress={() => handleSignUp()}>
                <Text style={[styles.headtxtn, { color: '#fff', }]}>ลงทะเบียน</Text>
            </TouchableOpacity>
            <Pressable style={{ top: -8, width: width * 0.3, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} onPress={() => props.navigation.navigate('Login')}>
                <Text style={styles.normaltxt}>เข้าสู่ระบบ</Text>
            </Pressable>
        </ScrollView>
        // </KeyboardAvoidingView>
        // </KeyboardAwareScrollView>
    )
}

export default Register

const styles = StyleSheet.create({
    headtxt: {
        flex: 1,
        fontSize: width * 0.046,
        fontFamily: 'Mali-SemiBold',
        color: "#000",
        justifyContent: 'center',
        alignItems: 'center',

        // borderWidth: 1,
        // alignSelf: 'center'
        // position: 'relative',
        // top: 8,
    },
    headtxtn: {
        fontSize: width * 0.056,
        fontFamily: 'Mali-SemiBold',
        color: "#000",
        justifyContent: 'center',
        alignItems: 'center',

        // borderWidth: 1,
        // alignSelf: 'center'
        // position: 'relative',
        // top: 8,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#2DB6A3',
        paddingHorizontal: 24,
        paddingVertical: 24,
        overflow: 'hidden'
    },
    img: {
        width: width * 0.85,
        height: height * 0.36,
    },
    in: {
        flexDirection: 'row',
        backgroundColor: '#f3f3f3',
        borderRadius: 15,
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingHorizontal: 16,
        height: height * 0.07
    },
    conIcon: {
        width: width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,

    },
    inputForm: {
        gap: 16,
        top: -16
    },
    checkbox: {
        flexDirection: 'row'
    },
    conBut: {
        // borderWidth: 1,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        // alignContent: 'center',
        marginHorizontal: 24,
        marginTop: 8,
        top: -16,
        borderRadius: 30,
        backgroundColor: '#DFB497',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    circle: {
        width: height * 0.018,
        height: height * 0.018,
        borderRadius: (height * 0.018) / 2,
        // borderWidth: 1,
        backgroundColor: '#FFF9F3',
        position: 'absolute',
        right: width * 0.14,
        top: height * 0.05
    },
    circle1: {
        width: height * 0.025,
        height: height * 0.025,
        borderRadius: (height * 0.025) / 2,
        // borderWidth: 1,
        backgroundColor: '#cccccc',
        position: 'absolute',
        left: width * 0.08,
        top: height * 0.26
    },
    circle2: {
        width: height * 0.015,
        height: height * 0.015,
        borderRadius: (height * 0.015) / 2,
        // borderWidth: 1,
        backgroundColor: '#FFB9B9',
        position: 'absolute',
        right: width * 0.04,
        top: height * 0.35
    },
    eyeIcon: {
        justifyContent: 'center',
        alignItems: 'center'
    }

})