import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const AddIcon = () => (
    <View>
        <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
            <Circle cx="12.5" cy="12.5" r="12" fill="white" stroke="#FF6C00" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 6H12V12H6V13H12V19H13V13H19V12H13V6Z"
                fill="#FF6C00"
            />
        </Svg>
    </View>
);

export default AddIcon;