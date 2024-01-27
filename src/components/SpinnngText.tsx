import React, { useEffect, useState } from 'react';
import {
	Animated,
	Easing,
	ScrollView,
	StyleProp,
	Text,
	TextStyle,
	View,
} from 'react-native';
import styled from 'styled-components/native';

type Props = {
	text: string;
	textStyle?: StyleProp<TextStyle>;
};

const SpinnngText = ({ text, textStyle }: Props) => {
	const [containerWidth, setContainerWidth] = useState<number>(1);
	const [textWidth, setTextWidth] = useState<number>(0);
	const animation = new Animated.Value(0);
	if (containerWidth < textWidth) {
		Animated.loop(
			Animated.sequence([
				Animated.delay(1000),
				Animated.timing(animation, {
					toValue: (textWidth - containerWidth + 10) * -1,
					duration: 3000,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.delay(1000),
				Animated.timing(animation, {
					toValue: 0,
					duration: 3000,
					easing: Easing.linear,
					useNativeDriver: true,
				}),
			]),
		).start();
	}

	const animatedStyle = {
		transform: [
			{
				translateX: animation,
			},
		],
	};

	return (
		<Container onLayout={ev => setContainerWidth(ev.nativeEvent.layout.width)}>
			<ScrollView
				horizontal
				scrollEnabled={false}
				showsHorizontalScrollIndicator={false}>
				<Animated.View style={animatedStyle}>
					<DefaultText
						style={textStyle}
						onLayout={ev => setTextWidth(ev.nativeEvent.layout.width)}
						numberOfLines={1}>
						{text}
					</DefaultText>
				</Animated.View>
			</ScrollView>
		</Container>
	);
};

const Container = styled.View`
	flex-grow: 1;
`;

const DefaultText = styled.Text`
	font-size: 18px;
	color: '#000';
`;

export default SpinnngText;
