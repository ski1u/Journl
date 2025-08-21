import "@/global.css"

import { View, Text } from "react-native"
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg'


export default function LoadingScreen() {
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', width: 320, height: 320 }}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#58a76d" stopOpacity={0.6} />
                <Stop offset="70%" stopColor="#58a76d" stopOpacity={0.2} />
                <Stop offset="100%" stopColor="#58a76d" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="50" fill="url(#glow)" />
          </Svg>
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: '600',
            letterSpacing: -0.5
          }}
        >
          Journl.
        </Text>
    </View>
    )
}