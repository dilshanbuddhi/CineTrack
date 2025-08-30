import React from 'react';
import {View , Text} from "react-native";

const Home = () => {
    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="text-3xl font-bold mb-4">Task Manager</Text>
            <View className="bg-white rounded-lg p-4 shadow-lg">
                <Text className="text-xl font-bold">Tasks</Text>
                <View className="flex flex-row border-t-2 border-gray-300 my-2">
                    <Text className="w-1/3 text-lg">Task 1</Text>
                    <Text className="w-1/3 text-lg">Due Date</Text>
                    <Text className="w-1/3 text-lg">Priority</Text>
                </View>
                <View className="flex flex-row border-t-2 border-gray-300 my-2">
                    <Text className="w-1/3 text-lg">Task 2</Text>
                    <Text className="w-1/3 text-lg">Due Date</Text>
                    <Text className="w-1/3 text-lg">Priority</Text>
                </View>
                <View className="flex flex-row border-t-2 border-gray-300 my-2">
                    <Text className="w-1/3 text-lg">Task 3</Text>
                    <Text className="w-1/3 text-lg">Due Date</Text>
                    <Text className="w-1/3 text-lg">Priority</Text>
                </View>
            </View>
        </View>
    );
};

export default Home;