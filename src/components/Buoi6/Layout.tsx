// Layout.tsx
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Dùng icon thư viện react-native-vector-icons

const Layout = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../Img/1.jpg')} style={styles.logo} />
                <Image source={require('../../Img/1.jpg')} style={styles.banner} />
            </View>

            {/* Body */}
            <View style={styles.body}>
                <View style={styles.sidebar}>
                    <Text style={styles.text}>Sidebar</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.text}>Nội dung chính</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>© Norikachi 2025</Text>
                    <Text style={styles.footerText}>Chính sách bảo mật</Text>
                </View>
                <View style={styles.socialIcons}>
                    <Icon name="facebook" size={30} color="#3b5998" style={styles.icon} />
                    <Icon name="twitter" size={30} color="#1da1f2" style={styles.icon} />
                    <Icon name="instagram" size={30} color="#e1306c" style={styles.icon} />
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
        resizeMode: 'contain',
        marginRight: 10,
    },
    banner: {
        flex: 1,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 10,
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
        borderRadius: 10,
    },
    content: {
        flex: 3,
        backgroundColor: '#fceabb',
        padding: 10,
        borderRadius: 10,
    },
    footer: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        marginBottom: 5,
    },
    socialIcons: {
        flexDirection: 'row',
    },
    icon: {
        marginHorizontal: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerTextContainer: {
        alignItems: 'center',
    },
});