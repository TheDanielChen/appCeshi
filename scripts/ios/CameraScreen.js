import {
    Camera,
    Video,
    FileSystem,
    Permissions,
} from 'expo';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Slider,
    Image,
    Picker,
    Button,
    ScrollView,
    Vibration,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Util from './../util/util';
var Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;
const flashModeOrder = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
};

const wbOrder = {
    auto: 'sunny',
    sunny: 'cloudy',
    cloudy: 'shadow',
    shadow: 'fluorescent',
    fluorescent: 'incandescent',
    incandescent: 'auto',
};

export default class CameraScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'派件详情',
        header:null,
    });
    state = {
        expressId:'',
        userId:'',
        categoryId:'',
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        ratios: [],
        photoId: 1,
        showGallery: false,
        photos: [],
        ph:[],
    };

    // componentWillMount(){
    //     const { params } = this.props.navigation.state;
    //     let categoryId = params.categoryId;
    //     this.setState({
    //         expressId:params.expressId,
    //         userId:params.userId,
    //         categoryId:categoryId,
    //     });
    //     console.log('接收'+categoryId)
    // }


    getRatios = async function() {
        const ratios = await this.camera.getSupportedRatios();
        return ratios;
    };

    toggleView() {
        this.setState({
            showGallery: !this.state.showGallery,
        });
    }

    toggleFacing() {
        this.setState({
            type: this.state.type === 'back' ? 'front' : 'back',
        });
    }

    toggleFlash() {
        this.setState({
            flash: flashModeOrder[this.state.flash],
        });
    }

    setRatio(ratio) {
        this.setState({
            ratio,
        });
    }

    toggleWB() {
        this.setState({
            whiteBalance: wbOrder[this.state.whiteBalance],
        });
    }

    toggleFocus() {
        this.setState({
            autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
        });
    }

    zoomOut() {
        this.setState({
            zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
        });
    }

    zoomIn() {
        this.setState({
            zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
        });
    }

    setFocusDepth(depth) {
        this.setState({
            depth,
        });
    }


    okPhoto(userId,expressId,categoryId){
        const { params } = this.props.navigation.state;
        console.log(params.categoryId);
        var img= this.state.ph[0];
        let formData = new FormData();
        let file = {uri: img, type: 'multipart/form-data', name: 'a.jpg'};

        formData.append("file",file);
        formData.append("userId",userId);
        formData.append("expressId",expressId);
        formData.append("category",categoryId);
        formData.append("suffix",'.jpg');

        fetch(Util.baseUrl + 'mobile/express/uploadImg1',{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData,
        })
            .then((response) => response.text() )
            .then((responseData)=>{
                this.props.navigation.navigate('PiecesDetail',{expressId:expressId,userId:userId});
            })
            .catch((error)=>{console.error('error',error)});


    };

    takePicture(){
        if (this.camera) {
            this.camera.takePictureAsync().then(data => {
                console.log(data);
                let data2 = [];
                data2.push(data);
                this.setState({
                        ph:data2,
                        showGallery:!this.state.showGallery,
                    });


            });
        }
    };

    renderCamera(){
        return(
            <Camera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    flex: 1,
                }}
                type={this.state.type}
                flashMode={this.state.flash}
                autoFocus={this.state.autoFocus}
                zoom={this.state.zoom}
                whiteBalance={this.state.whiteBalance}
                ratio={this.state.ratio}
                focusDepth={this.state.depth}>
                <View
                    style={{
                        flex: 0.5,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                        style={styles.flipButton2}
                        onPress={this.toggleFacing.bind(this)}>
                        <Text style={styles.flipText2}> FLIP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton2}
                        onPress={this.toggleFlash.bind(this)}>
                        <Text style={styles.flipText2}>
                            {' '}FLASH: {this.state.flash}{' '}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton2}
                        onPress={this.toggleWB.bind(this)}>
                        <Text style={styles.flipText2}>
                            {' '}WB: {this.state.whiteBalance}{' '}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 0.4,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>

                </View>
                <View
                    style={{
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>
                    <View style={{flex:2,alignItems:'flex-end',paddingRight:30,}}>
                        <TouchableOpacity
                            style={[
                                styles.flipSnapButton2,
                                styles.picButton2,
                            ]}
                            onPress={()=>{
                                this.takePicture(this.state.categoryId)
                            }
                            }>
                            <Text style={[styles.flipText,{color:'#fff'}]}> SNAP </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1,alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={()=> this.props.navigation.goBack()}>
                            <Ionicons style={{marginTop:20}}  name="ios-arrow-down" size={35} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>
        )
    }

        renderGallery(){
            return(
            <View style={styles.pictures2}>
                {this.state.ph.map(photoUri =>
                    <Image
                        style={styles.picture2}
                        source={{
                            uri: photoUri.uri,
                        }}
                        key={photoUri}
                    />
                )}
                <View style={{position:'absolute',flexDirection:'row',bottom:50,left:0,right:0}}>
                    <View style={{flex:1,alignItems:'center',}}>
                        <TouchableOpacity
                            style={{width:60,height:60,borderRadius:30,alignItems:'center',backgroundColor:'#ddd',justifyContent:'center'}}
                            onPress={()=>{
                                this.setState({
                                    showGallery:false,
                                })
                            }}>
                            <Ionicons  name="ios-return-left" size={40} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,alignItems:'center',}}>
                        <TouchableOpacity
                            style={{width:60,height:60,borderRadius:30,alignItems:'center',backgroundColor:'#fff',justifyContent:'center'}}
                            onPress={()=>this.okPhoto(this.state.userId,this.state.expressId,this.state.categoryId,)}>
                            <Ionicons  name="md-checkmark" size={40} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            )
        }

    render() {
        return (
            <View style={styles.containerCamera}>
                {this.state.showGallery ? this.renderGallery() : this.renderCamera()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerCamera: {
        flex: 1,
        backgroundColor: 'ivory',
    },
    // navigation: {
    //     flex: 1,
    // },
    // gallery: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    // },
    flipButton2: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipSnapButton2:{
        width:70,
        height:70,
        borderRadius:35,
        borderWidth:8,
        borderColor:"#ddd",
        justifyContent:'center',
        alignItems:'center',
    },
    flipText2: {
        color: '#fff',
        fontSize: 15,
        backgroundColor:null,
    },
    picButton2: {
        backgroundColor: '#fff',
    },
    galleryButton: {
        backgroundColor: 'indianred',
    },

    pictures2: {
        flex: 1,
        flexWrap: 'wrap',

    },
    picture2: {
        flex:1,
        resizeMode: 'contain',
        height:ScreenHeight,
    },
});

