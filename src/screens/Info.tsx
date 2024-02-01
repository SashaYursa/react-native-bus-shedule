import React, { useState } from 'react';
import { Linking } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PrivacyPolicy from '../utils/privacyPolicy';
import Disclaimer from '../utils/disclaimer';
import disclaimer from '../utils/disclaimer';
type Props = {};
type section = {
	title: string;
	content: string;
	icon: string;
};
const SECTIONS: section[] = [
	{
		icon: 'police-badge',
		title: 'Політика конфіденційності',
		content: PrivacyPolicy.text,
	},
	{
		icon: 'alert-circle',
		title: 'Дисклеймер',
		content: disclaimer.text,
	},
];
const Info = (props: Props) => {
	const [activeSection, setActiveSection] = useState<number[]>([]);

	const renderHeader = (
		{ title, icon }: section,
		index: number,
		isActive: boolean,
	) => {
		return (
			<AccordionHeader
				style={
					isActive && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
				}>
				<Icon name={icon} size={25} color="#41b874" />
				<HeaderText>{title}</HeaderText>
			</AccordionHeader>
		);
	};
	const renderContent = ({ content }: section) => {
		return (
			<AccordionBody contentContainerStyle={{ padding: 10 }}>
				<BodyText>{content}</BodyText>
			</AccordionBody>
		);
	};
	return (
		<Container>
			<InfoContainer>
				<Accordion
					activeSections={activeSection}
					sections={SECTIONS}
					renderHeader={renderHeader}
					renderContent={renderContent}
					onChange={indexes => setActiveSection(indexes)}
					touchableProps={{
						activeOpacity: 0.3,
						style: {
							marginLeft: 10,
							marginRight: 10,
							borderRadius: 12,
							marginTop: 10,
						},
					}}
				/>
			</InfoContainer>
			<SendEmailButton
				onPress={() => {
					Linking.openURL('mailto:sasha.yursa13@gmail.com');
				}}>
				<SendEmailText>Зв'язатись з автором</SendEmailText>
			</SendEmailButton>
		</Container>
	);
};

const Container = styled.View`
	flex-grow: 1;
	background-color: #fff;
`;
const InfoContainer = styled.View`
	flex-grow: 1;
`;
const SendEmailButton = styled.TouchableOpacity`
	padding: 10px;
	background-color: #000;
	border-radius: 50px;
	margin: 10px;
`;
const SendEmailText = styled.Text`
	font-size: 16px;
	font-weight: 700;
	color: #fff;
	text-align: center;
`;
const AccordionHeader = styled.View`
	padding: 10px;
	background-color: #eaeaea;
	border-radius: 12px;
	border-color: #919191;
	border-width: 1px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
const HeaderText = styled.Text`
	color: #000;
	text-align: center;
	font-size: 16px;
	flex-grow: 1;
	font-weight: 700;
`;

const AccordionBody = styled.ScrollView`
	background-color: #eaeaea;
	border-radius: 0 0 12px 12px;
	margin-left: 10px;
	margin-right: 10px;
	height: 400px;
`;

const BodyText = styled.Text`
	font-size: 16px;
	text-align: justify;
	color: #000;
`;

export default Info;
