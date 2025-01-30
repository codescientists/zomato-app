import { icons, images } from '@/constants';
import { useFetch } from '@/lib/fetch';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Button, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Modal from "react-native-modal";
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomBackdrop from '@/components/CustomBackdrop';

type ItemProps = { item: { _id: string, name: string, description: string, imageUrl: string, category: string, rating: number, price: number }, handleFoodItemPress: any };

const Item = ({ item, handleFoodItemPress }: ItemProps) => (
    <Pressable onPress={() => handleFoodItemPress(item._id)} >
        <View className="flex flex-row items-center p-4 border-b border-gray-300 border-dashed py-10 overflow-hidden">
            <View className="w-1/2 gap-2">
                <View className="flex flex-row gap-2 items-center">
                    <Text className="bg-yellow-500 rounded-md px-2 text-gray-50 text-xs py-1">Bestseller</Text>
                </View>
                <Text className="font-bold text-lg">{item.name}</Text>
                <View className="flex items-start">
                    <Text className="text-sm px-2 text-green-600 border border-green-600 bg-green-50 rounded-full">{item.category}</Text>
                </View>
                <Text className="text-xl font-extrabold my-1">₹{item.price}</Text>
                <Text className="text-gray-500 line-clamp-2">{item.description}</Text>

                <View className="flex flex-row items-center justify-center gap-2 border border-gray-100 rounded-full w-fit p-2 mt-2">
                    <Feather name="bookmark" size={18} color="#e23744" />
                    <Text className="text-xs font-semibold text-gray-500">Add to collection</Text>
                </View>
            </View>
            <View className="relative flex items-center justify-center w-1/2">
                <Image src={item.imageUrl} className="w-36 h-36 object-cover rounded-3xl" />
                <TouchableOpacity className="absolute -bottom-4 bg-red-100 border border-red-500 border-dashed rounded-lg w-24 h-10 flex items-center justify-center">
                    <Text className="font-bold text-red-700">ADD</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Pressable>
);

const Restaurant = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { isAuthenticated } = useAuth();
    const { carts, addItemToCart, increaseQuantity, decreaseQuantity } = useCart();
    const [currentCart, setCurrentCart] = useState<any>(null)
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    if (!isAuthenticated) {
        router.push(`/(auth)/login`)
    }

    useEffect(() => {
        setCurrentCart(carts.filter((item) => item?.restaurant?._id === id))
    }, [carts])

    console.log("CARTS -> ", carts)
    console.log("CURRENT CART -> ", currentCart)

    const {
        data: restaurant,
        loading,
        error,
    } = useFetch<any>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/restaurants/${id}`);

    const [modalActiveItem, setModalActiveItem] = useState<{ _id: string, name: string, description: string, imageUrl: string, category: string, rating: number, price: number } | null>(null)

    const handleFoodItemPress = async (id: any) => {
        const activeItem = await restaurant?.menu.find((item: any) => item._id == id);
        setModalActiveItem(activeItem)
        handlePresentModalPress()
    }

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["70%"], []);
    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleModalClose = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);



    return (
        <GestureHandlerRootView >
            <BottomSheetModalProvider>
                <SafeAreaView className="bg-white">
                    <FlatList
                        data={restaurant?.menu}
                        renderItem={({ item }) => <Item item={item} handleFoodItemPress={handleFoodItemPress} />}
                        keyExtractor={(item, index) => item._id}
                        className="px-3"
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingBottom: 100,
                        }}
                        ListEmptyComponent={() => (
                            <View className="flex flex-col items-center justify-center py-10">
                                {!loading ? (
                                    <>
                                        <Image
                                            source={icons.dineIn}
                                            className="w-36 h-36"
                                            alt="No recent rides found"
                                            resizeMode="contain"
                                        />
                                        <Text className="text-xl">No food items available.</Text>
                                    </>
                                ) : (
                                    <ActivityIndicator size="small" color="#e23744" />
                                )}
                            </View>
                        )}
                        ListHeaderComponent={
                            <View className="relative">
                                <View className="flex flex-row items-center justify-between my-2 w-full">
                                    <Link href={`/(root)/(tabs)/delivery`} asChild>
                                        <Pressable>
                                            <View className="flex flex-row items-center gap-2">
                                                <AntDesign name="left" size={24} color="black" />
                                            </View>
                                        </Pressable>
                                    </Link>
                                    <View className="flex flex-row items-center gap-2">
                                        <Feather name="bookmark" size={24} color="black" />
                                        <Entypo name="dots-three-vertical" size={20} color="black" />
                                    </View>
                                </View>

                                <View className="mt-6 gap-2">
                                    <View className="flex flex-row items-center justify-between">
                                        <Text className="text-2xl font-bold">{restaurant?.name}</Text>
                                        <Text className="bg-green-600 text-white px-2 py-1 rounded-md">{restaurant?.averageRating} ✮</Text>
                                    </View>
                                    <View className="flex flex-row items-center justify-start gap-2">
                                        <Ionicons name="timer-outline" size={20} color="black" />
                                        <Text>37 mins • 6.5 km • {restaurant?.address?.city}</Text>
                                    </View>
                                    <View className="flex flex-row items-center justify-start gap-2">
                                        <MaterialCommunityIcons name="calendar-clock-outline" size={20} color="black" />
                                        <Text>Schedule for later</Text>
                                    </View>
                                    <View className="h-[1px] w-full my-1 bg-gray-300" />
                                    <View className="flex flex-row items-center gap-2">
                                        <Image source={icons.discountBadge} className="w-5 h-5" />
                                        <Text className="font-semibold text-gray-500">Flat ₹125 OFF + ₹25 cashback</Text>
                                    </View>
                                </View>

                                <View className="flex flex-row items-center justify-center mt-8">
                                    <Text className="mx-4 font-bold text-lg tracking-widest uppercase">Our menu</Text>
                                </View>

                                <View className="absolute bottom-0 left-0 bg-red-400 w-full">
                                    <Modal className="m-0" animationIn="slideInUp" isVisible={orderModalVisible} onBackButtonPress={() => setOrderModalVisible(false)} onBackdropPress={() => setOrderModalVisible(false)}>
                                        <View className="bg-gray-50 h-[90%] mt-auto w-full rounded-2xl p-4">

                                            <ScrollView>
                                                {/* Gold Membership */}
                                                <View className="flex-row justify-between items-center bg-yellow-50 p-4 rounded-lg mb-4 gap-2">
                                                    <View className="w-[70%]">
                                                        <Text className="text-base font-semibold">Get Gold for 3 months</Text>
                                                        <Text className="text-sm text-gray-500">Unlimited free deliveries & more benefits</Text>
                                                        <Pressable>
                                                            <Text className="text-sm text-red-500">Learn more</Text>
                                                        </Pressable>
                                                    </View>
                                                    <View className="flex-col items-center">
                                                        <Pressable className="border border-red-600 px-3 py-1 rounded-md">
                                                            <Text className="text-red-600 font-semibold text-sm">ADD</Text>
                                                        </Pressable>
                                                        <Text className="text-sm font-semibold ml-4 mt-2">₹30</Text>
                                                    </View>
                                                </View>

                                                {/* Food Item */}
                                                <View className="bg-white p-4 rounded-lg mb-4">
                                                    {
                                                        currentCart && currentCart[0]?.items?.map((item: any) => (
                                                            <View key={item._id} className="border-b border-gray-300 border-dashed pb-4 pt-2">
                                                                <View className="flex-row justify-between">
                                                                    <Text className="text-base font-semibold">{item?.name?.slice(0, 20)}{item.name.length > 20 && "..."}</Text>
                                                                    <View className="flex-row items-center border border-[#e23744] bg-red-50 p-1 rounded-lg">
                                                                        <TouchableOpacity onPress={() => decreaseQuantity(id, item._id, item.quantity - 1)}>
                                                                            <Feather name="minus" size={16} color="#e23744" />
                                                                        </TouchableOpacity>
                                                                        <Text className="mx-3 font-bold">{item.quantity}</Text>
                                                                        <TouchableOpacity onPress={() => increaseQuantity(id, item._id, item.quantity + 1)}>
                                                                            <Feather name="plus" size={16} color="#e23744" />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                                <View className="flex-row justify-between items-center mt-2">

                                                                    <Text className="text-sm text-gray-500 font-semibold">₹{item.price}</Text>

                                                                    <View className="flex-row justify-between items-center gap-2">
                                                                        {/* <Text className="text-base text-gray-500 line-through">₹{item.menuItem.originalPrice}</Text> */}
                                                                        <Text className="text-base text-green-600 font-bold">₹{(item.price * item.quantity)}</Text>
                                                                    </View>
                                                                </View>
                                                                <Text className="text-gray-500 mt-2 text-xs">NOT ELIGIBLE FOR COUPONS</Text>
                                                            </View>
                                                        ))
                                                    }
                                                </View>

                                                {/* Note for restaurant */}
                                                <Pressable className="border border-gray-300 p-4 rounded-lg mb-4">
                                                    <Text className="text-base font-semibold">Add a note for the restaurant</Text>
                                                </Pressable>

                                                {/* Discount Section */}
                                                <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-4">
                                                    <View className="flex-row items-center">
                                                        <Text className="text-base font-semibold">Items starting @ ₹99 only applied!</Text>
                                                        <Text className="text-green-500 ml-2">- ₹1.00</Text>
                                                    </View>
                                                </View>

                                                {/* Coupons */}
                                                <Pressable className="bg-white p-4 rounded-lg mb-4">
                                                    <Text className="text-base text-red-500">View all coupons</Text>
                                                </Pressable>

                                                {/* Delivery Time */}
                                                <View className="flex-row justify-between items-center bg-white p-4 rounded-lg mb-4">
                                                    <Text className="text-base font-semibold">Delivery in</Text>
                                                    <Text className="text-xs text-gray-600">38 mins</Text>
                                                </View>
                                                <View className="flex-col justify-between items-start bg-white p-4 rounded-lg mb-4">
                                                    <Text className="text-base font-semibold">Deliver at Home</Text>
                                                    <Text className="text-base text-gray-500">Chirle, Belondakhar, India</Text>
                                                </View>

                                                {/* Payment */}
                                                <Pressable className="bg-white p-4 rounded-lg mb-4 flex-row justify-between items-center">
                                                    <View>
                                                        <Text className="text-base font-semibold">Zomato Money</Text>
                                                        <Text className="text-sm text-gray-500">Single tap payments. Zero failures</Text>
                                                    </View>
                                                    <Text className="text-red-500">NEW</Text>
                                                </Pressable>


                                            </ScrollView>

                                            <View className="mt-auto py-4">
                                                <View className="flex-row justify-between items-center">
                                                    <View>
                                                        <Text className="text-lg font-semibold">₹{currentCart && currentCart[0]?.totalPrice}</Text>
                                                        <Text className="text-sm font-semibold text-gray-500">TOTAL</Text>
                                                    </View>
                                                    <TouchableOpacity className="bg-[#e23744] p-4 rounded-md w-[50%] flex items-center justify-center">
                                                        <Text className="text-white font-semibold">Place Order</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>


                                <BottomSheetModal
                                    ref={bottomSheetModalRef}
                                    index={1}
                                    backdropComponent={CustomBackdrop}
                                    snapPoints={snapPoints}
                                    onChange={handleSheetChanges}
                                >
                                    <BottomSheetScrollView >
                                        <View className="bg-white mt-auto w-full rounded-2xl">
                                            <View className="flex flex-col items-start justify-start p-4 py-5 overflow-hidden">

                                                <View className="relative flex items-center justify-center w-full">
                                                    <Image src={modalActiveItem?.imageUrl} className="w-full h-52 object-cover rounded-xl" />
                                                </View>

                                                {/* <ScrollView className="w-full h-80"> */}
                                                <View className="gap-2 mt-4 w-full">
                                                    <View className="flex flex-row gap-2">
                                                        <Text className="bg-yellow-600 rounded-md px-2 text-gray-50 text-xs py-1">Bestseller</Text>
                                                    </View>
                                                    <Text className="font-bold text-lg tracking-wide">{modalActiveItem?.name}</Text>
                                                    <View className="flex items-start">
                                                        <Text className="text-sm px-2 text-green-600 border border-green-600 bg-green-50 rounded-full">{modalActiveItem?.category}</Text>
                                                    </View>
                                                    <Text className="text-lg font-bold my-1">₹{modalActiveItem?.price}</Text>
                                                    <Text className="text-gray-500 text-[15px] my-2">{modalActiveItem?.description}</Text>

                                                    <View className="flex flex-row items-center justify-center gap-2 border border-gray-100 rounded-full w-fit p-2 mt-2">
                                                        <Feather name="bookmark" size={18} color="#e23744" />
                                                        <Text className="text-xs font-semibold text-gray-500">Add to collection</Text>
                                                    </View>
                                                </View>
                                                {/* </ScrollView> */}

                                            </View>
                                            <View className="mt-auto">
                                                <TouchableOpacity onPress={() => (addItemToCart(id, modalActiveItem?._id, modalActiveItem?.name, modalActiveItem?.price, 1), handleModalClose())} className="m-4 bg-[#e23744] flex items-center justify-center py-3 rounded-xl">
                                                    <Text className="text-white text-md">Add item ₹{modalActiveItem?.price}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </BottomSheetScrollView>
                                </BottomSheetModal>

                                <Modal animationIn="slideInUp" isVisible={showSuccessModal} onBackdropPress={() => setShowSuccessModal(false)}>
                                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                                        <Image
                                            source={images.check}
                                            className="w-[110px] h-[110px] mx-auto my-5"
                                        />
                                        <Text className="text-3xl font-JakartaBold text-center">
                                            Order Placed!
                                        </Text>
                                        <Text className="text-base text-gray-400 font-Jakarta text-center my-2">
                                            We are delivering your order soon.
                                        </Text>
                                        <Button
                                            title="Track Order"
                                            color="#ff4251"
                                            onPress={() => router.push(`/(root)/profile`)}
                                        />
                                    </View>
                                </Modal>
                            </View>
                        }
                    />

                    {
                        (currentCart?.length > 0) &&
                        <View className="bg-[#ff4251] flex items-center justify-center absolute bottom-0 w-full h-20">
                            <TouchableOpacity className="flex flex-row items-center py-5 px-8" onPress={() => setOrderModalVisible(true)}>
                                <Text className="text-white text-lg">{currentCart[0]?.items?.length} items added</Text>
                                <View className="bg-white rounded-full ml-2"><Text className="text-[#e23744] p-[2px]"><Feather name='arrow-right' size={16} /></Text></View>
                            </TouchableOpacity>
                        </View>
                    }

                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>

    );
}

export default Restaurant
