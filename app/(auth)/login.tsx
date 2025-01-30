import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/authContext";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";

// Validation schema using Yup
const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(3, "Password must be at least 3 characters").required("Password is required"),
});

interface LoginFormData {
    email: string;
    password: string;
}

const LoginScreen: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const { isAuthenticated, login } = useAuth();

    if (isAuthenticated) {
        return <Redirect href="/(root)/(tabs)/delivery" />;
    }

    // Handle login submission
    const onSubmit = (data: LoginFormData) => {
        login(data.email, data.password)
    };

    return (

        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerClassName="h-full border">
                <Image source={images.loginImage} className="w-full h-2/5" resizeMode="cover" />

                <View className="px-10">
                    <Text className="text-2xl font-extrabold text-center my-4">
                        India's #1 Food Delivery {"\n"} <Text className="text-primary-300"> and Dining App </Text>
                    </Text>

                    {/* Email Field */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    placeholder="Email"
                                    placeholderTextColor="#aaa"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                />
                                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                            </View>
                        )}
                    />

                    {/* Password Field */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.input, errors.password && styles.inputError]}
                                    placeholder="Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                            </View>
                        )}
                    />

                    {/* Login Button */}
                    <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <Text className="mt-4">Dont't have an account? <Text className="text-[#e23744] underline">Sign up</Text></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        fontSize: 16,
    },
    inputError: {
        borderColor: "#ff5a5f",
    },
    errorText: {
        color: "#ff5a5f",
        fontSize: 14,
        marginTop: 5,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#e23744",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "medium",
        letterSpacing: 2
    },
});

export default LoginScreen;
