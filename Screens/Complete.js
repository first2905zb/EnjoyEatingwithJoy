import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Orientation from 'react-native-orientation-locker'

const { width, height } = Dimensions.get('window')

const Complete = (props) => {
    const username = props.route.params;
    console.log(username)
    useEffect(() => {
        Orientation.lockToPortrait();
        return () => {
            Orientation.unlockAllOrientations();
        };
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.conImg}>
                <Image style={styles.img} source={require('./../assets/image/0.png')} />
            </View>
            <Text style={styles.headtxt}>Registration</Text>
            <Text style={[styles.headtxt, { marginTop: -16, }]}>Complete</Text>
            <TouchableOpacity style={styles.conBut} onPress={() => props.navigation.navigate('Profile0', { username })}>
                <Text style={[styles.headtxt, { top: -8, color: '#fff' }]}>Register</Text>
            </TouchableOpacity>
            <View style={styles.circle}></View>
            <View style={styles.circle1}></View>
            <View style={styles.circle2}></View>
            <View style={styles.circle3}></View>
            <View style={styles.circle4}></View>
            <View style={styles.circle5}></View>
        </View>
    )
}

export default Complete

const styles = StyleSheet.create({
    headtxt: {
        fontSize: width * 0.075,
        fontFamily: 'Mali-SemiBold',
        color: "#464444",
        textAlign: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#22C7A9',
        alignContent: 'center',
        padding: 24,
        paddingVertical: height * 0.15,
    },
    conImg: {
        width: width * 0.6,
        height: height * 0.43,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative',
    },
    img: {
        width: width * 0.75,
        height: height * 0.5,
        alignSelf: 'center',
    },
    conBut: {
        // borderWidth: 1,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 24,
        marginTop: 24,
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
        left: width * 0.15,
        top: height * 0.38
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