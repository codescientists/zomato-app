// import SearchTextInput from '@/components/SearchTextInput';
import { icons, images } from '@/constants';
import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFetch } from '@/lib/fetch';
import { Fragment } from 'react';
import { useAuth } from '@/context/authContext';
import { AntDesign } from '@expo/vector-icons';
import SearchTextInput from '@/components/SearchTextInput';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ItemProps = { item: { _id: string, name: string, bannerImages: string[], cuisines: string[], averageRating: number, averageCostForTwo: number } };

const Item = ({ item }: ItemProps) => {

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));


  return (
    <Link href={`/(root)/restaurants/${item._id}`} key={item._id} asChild>
      <AnimatedPressable
        onPressIn={() => (scale.value = withSpring(0.96))} // Shrink effect
        onPressOut={() => (scale.value = withSpring(1))} // Back to normal
        style={animatedStyle}
      >
        <View className="border border-gray-300 my-4 rounded-3xl overflow-hidden"
          style={{
            borderRadius: 24, // Ensure it matches your border radius
            backgroundColor: "white",
            marginVertical: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8, // For Android shadow
          }}>
          <Image src={item.bannerImages[0]} className="w-full h-56" />
          <View className="px-4 py-4">
            <Text className="font-bold text-lg">{item.name}</Text>
            <Text className="font-medium text-gray-500">{item.cuisines[0]} • ₹{item.averageCostForTwo} for one </Text>
            <View className="h-[1px] w-full my-2 bg-gray-300" />
            <View className="flex flex-row items-center gap-2">
              <Image source={icons.discountBadge} className="w-5 h-5" />
              <Text className="font-semibold text-gray-500">Flat ₹125 OFF + ₹25 cashback</Text>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Link>
  );
}

export default function DeliveryScreen() {
  const {
    data: restaurants,
    loading,
    error,
  } = useFetch<any>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/restaurants`);
  const { isAuthenticated } = useAuth();

  return (
    <SafeAreaView className="h-full flex items-center justify-center bg-white px-2">
      <FlatList
        data={restaurants}
        renderItem={({ item }) => <Item item={item} key={item._id} />}
        keyExtractor={(item, index) => item._id}
        className="px-3"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <Fragment>
                <Image
                  source={icons.dineIn}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-[8px]">No restaurants found</Text>
              </Fragment>
            ) : (
              <ActivityIndicator size="small" color="#e23744" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <Fragment>
            <View className="flex flex-row items-center justify-between my-2 w-full">
              <View className="flex flex-row items-center gap-2">
                <Image source={icons.locationPin} className="w-6 h-6" tintColor="#e23744" />
                <View>
                  <Text className="text-lg font-bold">
                    Home
                  </Text>
                  <Text className="text-md font-medium text-gray-500">
                    Chirle, Belondkhar, India
                  </Text>
                </View>
              </View>
              <View
                className="flex justify-center items-center w-12 h-12 rounded-full bg-blue-100"
              >
                {
                  isAuthenticated ?
                    <Link href={`/(root)/profile`} className="text-b8e-600 text-lg font-semibold leading-none w-fit h-fit">
                      P
                    </Link>
                    :
                    <Link href={`/(auth)/login`}>
                      <AntDesign name="login" size={20} color="black" />
                    </Link>
                }
              </View>
            </View>

            <SearchTextInput
              containerStyle="bg-white my-2"
            // handlePress={handleDestinationPress}
            />

            <Fragment>
              <View className="flex flex-row items-center justify-center mt-5 mb-2">
                <View className="h-[1px] flex-1 bg-gray-300" />
                <Text className="mx-4 text-gray-500 text-md tracking-widest">EXPLORE</Text>
                <View className="h-[1px] flex-1 bg-gray-300" />
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View className="flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-28 w-24">
                  <Image source={images.discount} className="w-8 h-8" tintColor="#3b82f6" />
                  <Text className="font-bold text-[11px] mt-2">Offers</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Up to 60% OFF</Text>
                </View>
                <View className="flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-28 w-24">
                  <Image source={images.party} className="w-8 h-8" />
                  <Text className="font-bold text-[11px] mt-2">Plan a party</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Diwali special</Text>
                </View>
                <View className="flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-28 w-24">
                  <Image source={images.brand} className="w-8 h-8" />
                  <Text className="font-bold text-[11px] mt-2">Brand Pack</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Extra offers</Text>
                </View>
                <View className="flex flex-col items-center justify-center bg-transparent border border-gray-300 rounded-2xl h-28 w-24">
                  <Image source={images.train} className="w-8 h-8" />
                  <Text className="font-bold text-[11px] mt-2">Food on train</Text>
                  <Text className="text-[9px] font-semibold text-gray-500">Delivery at seat</Text>
                </View>
              </ScrollView>
            </Fragment>

            <Fragment>
              <View className="flex flex-row items-center justify-center mt-5 mb-2">
                <View className="h-[1px] flex-1 bg-gray-300" />
                <Text className="mx-4 text-gray-500 text-md tracking-widest uppercase">What's on your mind?</Text>
                <View className="h-[1px] flex-1 bg-gray-300" />
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                }}>
                <View className="flex flex-col items-center space-y-2">
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.pizza} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Pizza</Text>
                  </View>
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.biryani} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Biryani</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.burger} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Burger</Text>
                  </View>
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.thali} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Thali</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.chicken} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Chicken</Text>
                  </View>
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.cake} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Cake</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.friedRice} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Fried Rice</Text>
                  </View>
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.northIndian} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">North Indian</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.rolls} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Rolls</Text>
                  </View>
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.dosa} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Dosa</Text>
                  </View>
                </View>
                <View className="flex flex-col items-center space-y-2">
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.sandwich} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Sandwich</Text>
                  </View>
                  <View className="flex flex-col items-center justify-center bg-transparent h-20 w-20 my-4">
                    <Image source={images.noodles} className="w-14 h-14 object-cover rounded-full" />
                    <Text className="font-medium text-[13px] mt-2">Noodles</Text>
                  </View>
                </View>
              </ScrollView>
            </Fragment>

            <View className="flex flex-row items-center justify-center mt-5 mb-2">
              <View className="h-[1px] flex-1 bg-gray-300" />
              <Text className="mx-4 text-gray-500 text-md tracking-widest uppercase">All Restaurants</Text>
              <View className="h-[1px] flex-1 bg-gray-300" />
            </View>
          </Fragment>
        }
      />
    </SafeAreaView>
  );
}
