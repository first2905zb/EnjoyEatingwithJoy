import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, Alert, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import { AuthContext } from './Context'
const { width, height } = Dimensions.get('window')

const Feedback = (props) => {
    const [feedback, setFeedback] = useState('');
    const feedbackEnpoint = 'https://takoyakist1-first.com/health/feedback'
    const now = moment().format('YYYY-MM-DD')
    const { username } = useContext(AuthContext);
    const insertData = async (url) => {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                text: feedback,
                date: now
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }
    console.log(username)
    console.log(now)
    const save = async () => {
        await insertData(feedbackEnpoint);
        Alert.alert('บันทึกสำเร็จ');
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.goBack}>
                    <Icon name='chevron-left' size={25} color={'black'} />
                </TouchableOpacity>
                <Text style={styles.headtxt}>ข้อเสนอแนะเพิ่มเติม</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.in}
                        autoComplete='none'
                        placeholder='ระบุข้อเสนอแนะเพิ่มเติม...'
                        value={feedback}
                        onChangeText={setFeedback}
                        multiline={true}
                    />
                </View>
                <TouchableOpacity onPress={() => save()} style={styles.save}>
                    <Text style={styles.headtxt}>ยืนยัน</Text>
                    <View style={styles.icon}>
                        <Icon name='play' size={20} color={'black'} />
                    </View>
                </TouchableOpacity>
                <Image style={styles.img} source={{ uri: 'https://images-ext-1.discordapp.net/external/yKw0BTHsV_acLeql4dX2G8avOWCRKDWlD8W701B4JXI/https/images.ctfassets.net/grb5fvwhwnyo/1sJpRsfp1RJI3AASMiOS1h/d5cca0a1c5d78df3052659f2b56a1225/SEO-Food-Fresh-Groceries.png?format=webp&quality=lossless&width=1267&height=662' }} />
            </View>
        </ScrollView>
    )
}

export default Feedback

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    goBack: {
        position: 'absolute',
        left: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    body: {
        marginVertical: 24,
        // gap: 30,
    },
    content: {
        borderWidth: 1,
        height: height * 0.5,
        borderColor: '#888',
        marginBottom: 30,
    },
    in: {
        padding: 16,
        position: 'relative',
        fontSize: width * 0.030,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    save: {
        flexDirection: 'row',
        borderWidth: 1,
        width: width * 0.5,
        alignSelf: 'center',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3C1C2',
        paddingHorizontal: 16
    },
    headtxt: {
        fontSize: width * 0.045,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    normaltxt: {
        fontSize: width * 0.030,
        fontFamily: 'Mali-SemiBold',
        color: "#000"
    },
    icon: {
        position: 'absolute',
        right: 16,
    },
    img: {
        width: width * 0.7,
        height: height * 0.25,
        alignSelf: 'center',
        position: 'relative',

    }
})