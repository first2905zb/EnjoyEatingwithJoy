import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image, Pressable, Alert, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from './Context';
import Orientation from 'react-native-orientation-locker';
import CryptoJS from 'crypto-js';
const { width, height } = Dimensions.get('window')

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const { signIn } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const userEnpoint = 'https://takoyakist1-first.com/health/user';


    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);

    const checkUser = () => {
        const hashPass = CryptoJS.SHA256(password).toString();
        const user = data.find(item => item.username === username && item.password === hashPass);
        if (user) {
            signIn(username);
        } else {
            Alert.alert('มีบางอย่างไม่ถูกต้องโปรดลองใหม่');
        }
    }

    useEffect(() => {
        fetch(userEnpoint)
            .then(res => res.json())
            .then(result => {
                setData(result);
            })
            .catch((err) => console.log('Error: fetching data ', err));
    }, [])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flexGrow: 1, }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ width: width, height: height * 0.33, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.circle}></View>
                    <View style={styles.circle1}></View>
                    <View style={styles.circle2}></View>
                    <View style={styles.circle3}></View>
                    <View style={styles.circle4}></View>
                    <View style={styles.circle5}></View>
                    <Image style={styles.img} source={{ uri: 'https://www.tourismthailand.org/images/home/experiences/thai-food.png.webp' }} />
                </View>
                <Text style={[styles.headtxt, { fontSize: width * 0.075, color: '#464444', textAlign: 'center', marginVertical: 16 }]}>ยินดีต้อนรับ</Text>
                <View style={styles.inputForm}>
                    <View style={styles.in}>
                        <View style={styles.conIcon}>
                            <Icon name='user' size={30} color={'#22C7A9'} />
                        </View>
                        <TextInput
                            placeholder='บัญชีผู้ใช้'
                            style={[styles.headtxt, { flex: 1, color: '#000' }]}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize='none'
                            placeholderTextColor="#000"
                            autoComplete='username'
                        />
                    </View>
                    <View style={styles.in}>
                        <View style={styles.conIcon}>
                            <Icon name='lock' size={30} color={'#22C7A9'} />
                        </View>
                        <TextInput
                            placeholder='รหัสผ่าน'
                            style={[styles.headtxt, { flex: 1, color: '#000' }]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={hidePass ? true : false}
                            placeholderTextColor="#000"
                            autoComplete='password'
                            autoCapitalize='none'
                        />
                        <TouchableOpacity onPress={() => setHidePass(!hidePass)} style={styles.eyeIcon}>
                            <Icon name={hidePass ? 'eye-slash' : 'eye'} size={20} color={'#22C7A9'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.conBut} onPress={checkUser}>
                    <Text style={[styles.headtxt, { top: 0, color: '#fff' }]}>เข้าสู่ระบบ</Text>
                </TouchableOpacity>
                <Pressable style={{ width: width * 0.3, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} onPress={() => props.navigation.navigate('Register')}>
                    <Text style={styles.normaltxt}>ลงทะเบียน</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    headtxt: {
        fontSize: width * 0.055,
        fontFamily: 'Mali-SemiBold',
        color: "#666161",
        position: 'relative',
        top: 8,
    },
    normaltxt: {
        fontSize: width * 0.045,
        fontFamily: 'Mali-SemiBold',
        color: "#fff"
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#2DB6A3',
        justifyContent: 'center',
        alignContent: 'center'
    },
    img: {
        width: width * 0.65,
        height: width * 0.65,
        borderRadius: (width * 0.65) / 2,
        alignSelf: 'center'
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
    },
    conBut: {
        borderRadius: 30,
        backgroundColor: '#DFB497',
        height: height * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    circle: {
        width: height * 0.018,
        height: height * 0.018,
        borderRadius: (height * 0.018) / 2,
        backgroundColor: '#FFF9F3',
        position: 'absolute',
        right: width * 0.14,
        top: height * -0.03
    },
    circle1: {
        width: height * 0.025,
        height: height * 0.025,
        borderRadius: (height * 0.025) / 2,
        backgroundColor: '#cccccc',
        position: 'absolute',
        left: width * 0.19,
        top: height * -0.032
    },
    circle2: {
        width: height * 0.013,
        height: height * 0.013,
        borderRadius: (height * 0.013) / 2,
        backgroundColor: '#FFB9B9',
        position: 'absolute',
        right: width * 0.05,
        top: height * 0.28
    },
    circle3: {
        width: height * 0.018,
        height: height * 0.018,
        borderRadius: (height * 0.018) / 2,
        backgroundColor: '#DFB497',
        position: 'absolute',
        left: width * 0.1,
        top: height * 0.34
    },
    circle4: {
        width: height * 0.01,
        height: height * 0.01,
        borderRadius: (height * 0.01) / 2,
        backgroundColor: '#FFF9F3',
        position: 'absolute',
        right: width * 0.14,
        top: height * 0.1
    },
    eyeIcon: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})
