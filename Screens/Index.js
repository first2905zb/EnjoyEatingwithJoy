import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Orientation from 'react-native-orientation-locker'
import CryptoJS from 'crypto-js'

const { width, height } = Dimensions.get('window')
const Index = (props) => {
    useEffect(() => {
        Orientation.lockToPortrait();
        // signOut()
        return () => {
            Orientation.unlockAllOrientations();
        };


    }, []);

    const pass = '123456';
    const hash = CryptoJS.SHA256(pass).toString();
    console.log(hash)
    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <View style={styles.imgContainer}>
                    <ImageBackground source={{ uri: 'https://t4.ftcdn.net/jpg/03/65/76/33/360_F_365763394_KsD8IOHsZVTsIaXMcDuDoJ9TfMNWnpix.jpg' }} imageStyle={styles.iconImg}>
                        <Image source={require('./../assets/image/program.png')} style={styles.img} />
                    </ImageBackground>
                </View>
                <View style={styles.title}>
                    <Text style={styles.headtxt}>น้องจอย</Text>
                    <Text style={styles.headtxt}>ยินดีต้อนรับค่ะ</Text>
                    <Text style={styles.normaltxt}>Enjoy eating with Joy</Text>
                </View>
                <View style={styles.containerBut}>
                    <Pressable style={styles.signin} onPress={() => props.navigation.navigate('Login')}>
                        <Text style={styles.headtxt}>เข้าสู่ระบบ</Text>
                    </Pressable>
                    <Pressable style={styles.signup} onPress={() => props.navigation.navigate('Register')}>
                        <Text style={[styles.headtxt, { color: '#000' }]}>ลงทะเบียน</Text>
                    </Pressable>
                </View>
                <View style={styles.circle}></View>
                <View style={styles.circle1}></View>
                <View style={styles.circle2}></View>
                <View style={styles.circle3}></View>
                <View style={styles.circle4}></View>
                <View style={styles.circle5}></View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Index

const styles = StyleSheet.create({
    headtxt: {
        fontSize: width * 0.065,
        fontFamily: 'Mali-SemiBold',
        color: "#fff",
        textAlign: 'center'
    },
    normaltxt: {
        fontSize: width * 0.035,
        fontFamily: 'Mali-SemiBold',
        color: "#888888",
        textAlign: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#22C7A9'
    },
    imgContainer: {
        alignSelf: 'center',
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        overflow: 'hidden',
        position: 'relative',
        top: height * 0.15,
    },
    iconImg: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: width * 0.4,
        height: height * 0.3,
        position: 'relative',
        left: 10,
        top: 35,
    },
    title: {
        position: 'relative',
        top: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBut: {
        flexDirection: 'row',
        width: width * 0.8,
        height: height * 0.085,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // borderWidth: 1,
        position: 'absolute',
        bottom: 100,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    signin: {
        flex: 1,
        backgroundColor: '#2DB6A3',
        height: height * 0.085,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signup: {
        flex: 1,
        backgroundColor: '#DADADA',
        height: height * 0.085,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: height * 0.018,
        height: height * 0.018,
        borderRadius: (height * 0.018) / 2,
        // borderWidth: 1,
        backgroundColor: '#F8BAA0',
        position: 'absolute',
        right: width * 0.14,
        top: height * 0.05
    },
    circle1: {
        width: height * 0.025,
        height: height * 0.025,
        borderRadius: (height * 0.025) / 2,
        // borderWidth: 1,
        backgroundColor: '#FFF9F3',
        position: 'absolute',
        left: width * 0.2,
        top: height * 0.12
    },
    circle2: {
        width: height * 0.015,
        height: height * 0.015,
        borderRadius: (height * 0.015) / 2,
        // borderWidth: 1,
        backgroundColor: '#FFB9B9',
        position: 'absolute',
        right: width * 0.04,
        top: height * 0.42
    },
    circle3: {
        width: height * 0.018,
        height: height * 0.018,
        borderRadius: (height * 0.018) / 2,
        // borderWidth: 1,
        backgroundColor: '#F8BAA0',
        position: 'absolute',
        right: width * 0.35,
        top: height * 0.45
    },
    circle4: {
        width: height * 0.018,
        height: height * 0.018,
        borderRadius: (height * 0.018) / 2,
        // borderWidth: 1,
        backgroundColor: '#FFF9F3',
        position: 'absolute',
        left: width * 0.34,
        top: height * 0.48
    },
    circle5: {
        width: height * 0.01,
        height: height * 0.01,
        borderRadius: (height * 0.01) / 2,
        // borderWidth: 1,
        backgroundColor: '#FFF9F3',
        position: 'absolute',
        right: width * 0.14,
        top: height * 0.2
    },
})