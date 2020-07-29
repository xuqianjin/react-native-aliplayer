/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import AliPlayer from 'react-native-aliplayer';

const sourceList = [
  {
    title: '资源1',
    url:
      'http://200024424.vod.myqcloud.com/200024424_709ae516bdf811e6ad39991f76a4df69.f20.mp4',
  },
  {
    title: '资源2香港',
    url:
      'https://d1t8oqe244440b.cloudfront.net/video/1595305528391_%E9%96%8B%E5%BF%83%E5%AD%97%E5%85%B8_%E7%AC%AC%E4%BA%8C%E8%BC%AF_EP4_%E8%9B%87.mp4',
  },
  {
    title: '资源3',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  },
  {
    title: '资源4香港',
    url:
      'https://d1t8oqe244440b.cloudfront.net/video/1595303223643_%E9%96%8B%E5%BF%83%E5%AD%97%E5%85%B8_%E7%AC%AC%E4%BA%8C%E8%BC%AF_EP2_%E7%B1%B3lr.mp4',
  },
  {
    title: '资源5香港',
    url:
      'https://d1t8oqe244440b.cloudfront.net/video/1595301535030_%E9%96%8B%E5%BF%83%E5%AD%97%E5%85%B8_%232_EP1_%E9%A6%AClr.mp4',
  },
  {
    title: '资源6凤凰直播',
    url:
      'https://81e0996f61b8eabc6b95e3a16c274256.live.prod.hkatv.com/p1_cbr_lo.m3u8',
  },
  {
    title: '资源7广东直播',
    url: 'rtmp://58.200.131.2:1935/livetv/gdtv',
  },
];

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const App = () => {
  const [index, setIndex] = useState(0);
  const source = sourceList[index];
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <AliPlayer
            title={source.title}
            source={source.url}
            style={{width: screenWidth, height: 200}}
          />
          {sourceList.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setIndex(index);
                }}
                activeOpacity={0.5}>
                <Text style={{lineHeight: 40}}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
