import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'

const Test = () => {
    const [test, setTest] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const url = 'http://54.66.90.121:5000/health/bloodresult';
    const url1 = 'http://54.66.90.121:5000/health/user';
    const url2 = 'http://54.66.90.121:5000/health/userprogram';
    const url3 = 'http://54.66.90.121:5000/health/consumefood';
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);

    const fetchData = async (url, setData) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            await fetchData(url, setData);
            await fetchData(url1, setData1);
            await fetchData(url2, setData2);
            await fetchData(url3, setData3);
            setIsLoading(false);
        };
        fetchAllData();
    }, []);

    console.log(data1)

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return (
        <View>
            {/* Render your test data here */}
            {/* <Text>{JSON.stringify(data)}</Text>
            <Text>{JSON.stringify(data1)}</Text>
            <Text>{JSON.stringify(data2)}</Text>
            <Text>{JSON.stringify(data3)}</Text> */}
        </View>
    );
};

export default Test;

const styles = StyleSheet.create({});
