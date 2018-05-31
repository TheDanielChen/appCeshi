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
import GalleryScreen from './GalleryScreen';

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

export default class ceshicamera extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'派件详情',
        header:null,
    });
    state = {
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
        isModalphoto:false,
    };

    componentDidMount() {
        FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + 'photos'
        ).catch(e => {
            console.log(e, 'Directory exists');
        });
    }



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

    takePicture = async function() {
        if (this.camera) {
            this.camera.takePictureAsync().then(data => {
                // FileSystem.moveAsync({
                //     from: data,
                //     to: `${FileSystem.documentDirectory}photos/Photo_${this.state
                //         .photoId}.jpg`,
                // }).then(() => {
                //     this.setState({
                //         photoId: this.state.photoId + 1,
                //         showGallery:true,
                //     });
                //     Vibration.vibrate();
                // });

                console.log(data);
                let data2 = [];
                data2.push(data);
                this.setState({
                    // photoId: this.state.photoId + 1,
                    ph:data2,
                    isModalphoto:!this.state.isModalphoto,
                });
            });
        }
    };

    ok= async function(){
        let data= this.state.ph[0];
        console.log(data);
        FileSystem.moveAsync({
            from: data,
            to: `${FileSystem.documentDirectory}photos/Photo_${this.state
                .photoId}.jpg`,
        }).then(() => {
            this.setState({
                photoId: this.state.photoId + 1,
                showGallery: !this.state.showGallery,
                isModalphoto:!this.state.isModalphoto,
            });
            Vibration.vibrate();

        });

    }

    componentWillMount(){
        FileSystem.deleteAsync( `${FileSystem.documentDirectory}photos`)
    }

    renderGallery() {
        return <GalleryScreen onPress={this.toggleView.bind(this)} />;
        // return(
        //     <View style={styles.container}>
        //         <TouchableOpacity
        //             style={styles.backButton}
        //             onPress={this.toggleView.bind(this)}>
        //             <Text>Back</Text>
        //         </TouchableOpacity>
        //         <ScrollView contentComponentStyle={{ flex: 1 }}>
        //             <View style={styles.pictures}>
        //                 {this.state.photos.map(photoUri =>
        //                     <Image
        //                         style={styles.picture}
        //                         source={{
        //                             uri: `${FileSystem.documentDirectory}photos/${photoUri}`,
        //                         }}
        //                         key={photoUri}
        //                     />
        //                 )}
        //             </View>
        //         </ScrollView>
        //     </View>
        // )
    }

    renderCamera() {
        return (
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
                        style={styles.flipButton}
                        onPress={this.toggleFacing.bind(this)}>
                        <Text style={styles.flipText}> FLIP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={this.toggleFlash.bind(this)}>
                        <Text style={styles.flipText}>
                            {' '}FLASH: {this.state.flash}{' '}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={this.toggleWB.bind(this)}>
                        <Text style={styles.flipText}>
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
                    <Slider
                        style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
                        onValueChange={this.setFocusDepth.bind(this)}
                        value={this.state.depth}
                        step={0.1}
                        disabled={this.state.autoFocus === 'on'}
                    />
                </View>
                <View
                    style={{
                        flex: 0.1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>
                    <TouchableOpacity
                        style={[
                            styles.flipButton,
                            styles.picButton,
                            { flex: 0.3, alignSelf: 'flex-end' },
                        ]}
                        onPress={this.takePicture.bind(this)}>
                        <Text style={styles.flipText}> SNAP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.flipButton,
                            styles.galleryButton,
                            { flex: 0.25, alignSelf: 'flex-end' },
                        ]}
                        onPress={this.toggleView.bind(this)}>
                        <Text style={styles.flipText}> Gallery </Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType='slide'           // 从底部滑入
                    transparent={false}             // 不透明
                    visible={this.state.isModalphoto}    // 根据isModal决定是否显示
                    onRequestClose={() => {this.onRequestCloseInfo()}}  // android必须实现
                >
                    <View>
                        {this.state.ph.map(photoUri =>
                            <Image
                                style={{width:250,height:350,}}
                                source={{
                                    uri: `${photoUri}`,
                                }}
                                key={photoUri}
                            />
                        )}
                    </View>
                    <TouchableOpacity
                        style={{width:60,height:60,borderRadius:30,alignItems:'center',backgroundColor:'#fff',justifyContent:'center'}}
                        onPress={()=>this.ok()}>
                        <Text>确认</Text>
                    </TouchableOpacity>
                </Modal>
            </Camera>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.showGallery ? this.renderGallery() : this.renderCamera()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'ivory',
    },
    navigation: {
        flex: 1,
    },
    gallery: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    flipButton: {
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
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    item: {
        margin: 4,
        backgroundColor: 'indianred',
        height: 35,
        width: 80,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    galleryButton: {
        backgroundColor: 'indianred',
    },
    row: {
        flexDirection: 'row',
    },
    pictures: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    picture: {
        width: 100,
        height: 100,
        margin: 5,
        resizeMode: 'contain',
    },
    backButton: {
        padding: 20,
        marginBottom: 4,
        backgroundColor: 'indianred',
    },
});

