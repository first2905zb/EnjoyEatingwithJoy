import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useContext } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { AuthContext } from './Context'
const { width, height } = Dimensions.get('window')


const Setting = (props) => {
    const { signOut } = useContext(AuthContext);
    const logOut = () => {
        Alert.alert(
            'ยืนยันออกจากระบบ',
            'คุณแน่ใจแล้วใช่มั้ยว่าจะออกจากระบบ',
            [
                {
                    text: 'ยกเลิก',
                    onPress: () => {
                        // ทำงานที่ต้องการเมื่อกดยกเลิก ตรงนี้
                        console.log('กดยกเลิก');
                    },
                    style: 'cancel'
                },
                {
                    text: 'ตกลง',
                    onPress: () => {
                        signOut();
                    }
                }
            ],
            { cancelable: true }
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.scrollviewContainer}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
                    <Icon name='chevron-left' size={25} color={'black'} />
                </TouchableOpacity>
                <View style={styles.setting}>
                    <Text style={styles.headtxt}>ตั้งค่า</Text>
                </View>
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.but} onPress={() => props.navigation.navigate('Feedback')}>
                    <Text style={[styles.normaltxt, { color: '#888' }]}>ข้อเสนอแนะ</Text>
                    <Icon name='chevron-right' size={15} color={'black'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.box, { justifyContent: 'center' }]} onPress={() => logOut()}>
                    <Text style={[styles.normaltxt, { color: 'red' }]}>ออกจากระบบ</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Setting

const styles = StyleSheet.create({
    scrollviewContainer: {
        flexGrow: 1,
    },
    header: {
        height: height * 0.07,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 24,
    },
    setting: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        margin: 16,
        padding: 16,
        gap: 16,
        justifyContent: 'space-between'
    },
    box: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        height: height * 0.06,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
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
    but: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})
