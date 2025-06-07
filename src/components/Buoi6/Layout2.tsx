import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

const Layout = () => {
    const openLink = (url: string) => {
        Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../Img/1.jpg')} style={styles.logo} />
                <Image source={require('../../Img/Banner.png')} style={styles.banner} />
            </View>

            {/* Body */}
            <View style={styles.body}>
                <View style={styles.sidebar}>
                    <Text style={styles.text}>Sidebar</Text>
                </View>
                <View style={styles.content}>
                    <ScrollView>
                        <View style={styles.productsContainer}>
                            {[ 
                                { id: 1, name: 'Bánh Tráng Trộn', price: '25.000đ', image: require('../../Img/1.jpg') },
                                { id: 2, name: 'Khô Gà Lá Chanh', price: '55.000đ', image: require('../../Img/2.jpg') },
                                { id: 3, name: 'Cơm Cháy Chà Bông', price: '30.000đ', image: require('../../Img/2.jpg') },
                                { id: 4, name: 'Chân Gà Sả Tắc', price: '40.000đ', image: require('../../Img/1.jpg') },
                                { id: 5, name: 'Snack Rong Biển', price: '22.000đ', image: require('../../Img/1.jpg') },
                                { id: 6, name: 'Bánh Snack Tôm', price: '18.000đ', image: require('../../Img/2.jpg') },
                                { id: 7, name: 'Trà Sữa Đóng Chai', price: '28.000đ', image: require('../../Img/2.jpg') },
                                { id: 8, name: 'Mực Rim Me', price: '65.000đ', image: require('../../Img/1.jpg') },
                                { id: 9, name: 'Chả Cá Lã Vọng', price: '45.000đ', image: require('../../Img/1.jpg') },
                                { id: 10, name: 'Gà Rán Giòn', price: '55.000đ', image: require('../../Img/2.jpg') },
                                { id: 11, name: 'Bánh Xèo', price: '35.000đ', image: require('../../Img/2.jpg') },
                                { id: 12, name: 'Nước Mía', price: '15.000đ', image: require('../../Img/1.jpg') },
                                { id: 13, name: 'Bánh Bao Chay', price: '20.000đ', image: require('../../Img/1.jpg') },
                                { id: 14, name: 'Hạt Dưa Lê', price: '25.000đ', image: require('../../Img/2.jpg') },
                                { id: 15, name: 'Khoai Tây Lắc', price: '18.000đ', image: require('../../Img/2.jpg') },
                                { id: 16, name: 'Bánh Chuối Nướng', price: '30.000đ', image: require('../../Img/1.jpg') }
                            ].map((item) => (
                                <View key={item.id} style={styles.productCard}>
                                    <Image source={item.image} style={styles.productImage} />
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>{item.price}</Text>
                                    <TouchableOpacity
                                        style={styles.buyButton}
                                        activeOpacity={0.8}
                                        onPress={() => console.log('Mua ngay:', item.name)}
                                    >
                                        <Text style={styles.buyButtonText}>Mua ngay</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerBox}>
                    <View style={styles.footerInfoContainer}>
                        <Image source={require('../../Img/2.jpg')} style={styles.footerLogo} />
                        <View style={styles.footerDetails}>
                            <Text style={styles.footerInfo}>Norikachi - Thế giới đồ ăn vặt</Text>
                            <Text style={styles.footerInfo}>Email: phatchau16520@gmail.com</Text>
                            <Text style={styles.footerInfo}>Địa chỉ: 99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, Đà Nẵng 550000</Text>
                            <Text style={styles.footerInfo}>SĐT: 0935.370.171</Text>
                        </View>
                    </View>

                    <View style={styles.socialIcons}>
                        <TouchableOpacity onPress={() => openLink('https://www.facebook.com')}>
                            <Icon name="facebook" size={26} color="#3b5998" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://www.twitter.com')}>
                            <Feather name="x" size={26} color="#000000" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://www.instagram.com')}>
                            <Icon name="instagram" size={26} color="#e1306c" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://www.linkedin.com')}>
                            <Icon name="linkedin" size={26} color="#0077b5" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://www.youtube.com')}>
                            <Icon5 name="youtube" size={26} color="#ff0000" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Layout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: 2,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    logo: {
        width: 80,
        height: 80,
        // height: 100,
        resizeMode: 'contain',
        marginRight: 10,
        borderRadius: 11,
    },
    banner: {
        flex: 1,
        height: 80,
        // height: 100,
        resizeMode: 'cover',
        borderRadius: 11,
    },
    body: {
        flex: 5,
        flexDirection: 'row',
        padding: 10,
    },
    sidebar: {
        flex: 1,
        backgroundColor: '#d3f8e2',
        marginRight: 10,
        padding: 10,
        borderRadius: 11,
    },
    content: {
        flex: 3,
        backgroundColor: '#fceabb',
        padding: 10,
        borderRadius: 11,
    },
    // footer: {
    //     height: 80,
    //     borderTopWidth: 1,
    //     borderColor: '#ccc',
    //     padding: 10,
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     marginBottom: 20,
    // },
    // footerText: {
    //     fontSize: 16,
    //     marginBottom: 5,
    // },
    // socialIcons: {
    //     flexDirection: 'row',
    // },
    // icon: {
    //     marginHorizontal: 10,
    // },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    // footerTextContainer: {
    //     alignItems: 'center',
    // },
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 11,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 11,
        marginBottom: 5,
    },
    productName: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 3,
    },
    productPrice: {
        fontSize: 13,
        color: '#e53935',
        fontWeight: 'bold',
    },
    buyButton: {
        marginTop: 10,
        backgroundColor: '#4caf50',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        transform: [{ scale: 1 }],
        transitionDuration: '200ms',
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },    
    // footerInfo: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 10,
    //     width: '100%',
    // },
    // footerLogo: {
    //     width: 60,
    //     height: 60,
    //     resizeMode: 'contain',
    //     borderRadius: 10,
    //     marginRight: 10,
    // },
    // footerDetails: {
    //     flex: 1,
    //     justifyContent: 'center',
    // },    
    // footerInfoContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 10,
    // },

    footer: {
        padding: 0.1,
        backgroundColor: '#f8f8f8',
    },
    footerBox: {
        // height: 160,//
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 11,
        padding: 16,
        backgroundColor: '#333',
        margin: 9,
        marginTop: -1,
    },
    footerInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        // marginTop: -10,//
    },
    footerLogo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: 11,
        marginRight: 10,
    },
    footerDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    footerInfo: {
        color: '#fff',
        marginBottom: 3,
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    icon: {
        marginHorizontal: 10,
    },    
});