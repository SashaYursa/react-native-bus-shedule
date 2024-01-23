import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import SearchField from './SearchField';
import styled from 'styled-components/native';
import { FlashList } from '@shopify/flash-list';
import Collapsible from 'react-native-collapsible';

type Props = {
	itemsForSearch: string[];
	title: string;
	setSearchedVale: (value: string) => void;
};

const SearchFieldWithDropdown = ({
	itemsForSearch,
	title,
	setSearchedVale,
}: Props) => {
	const [searchItem, setSearchItem] = useState<{
		value: string | undefined;
		type: 'input' | undefined;
	}>({ value: undefined, type: undefined });
	const [valuesForSearchList, setValuesForSearchList] = useState<string[]>([]);
	const [collapsed, setCollapsed] = useState<boolean>(true);
	const [animationEnd, setAnimationEnd] = useState<boolean>(false);

	useEffect(() => {
		if (searchItem.type === 'input' && typeof searchItem.value === 'string') {
			const searchedValue = searchItem.value.toUpperCase();
			setValuesForSearchList(
				itemsForSearch.filter(item =>
					item.toUpperCase().includes(searchedValue),
				),
			);
			if (searchItem.value.length > 0) {
				setCollapsed(false);
			} else {
				setCollapsed(true);
			}
		} else if (typeof searchItem.value === 'string') {
			setSearchedVale(searchItem.value);
			setCollapsed(true);
		}
		return () => {
			setCollapsed(true);
		};
	}, [searchItem]);
	return (
		<Animated.View>
			<SearchField
				itemsForSearch={itemsForSearch.map(item => ({
					title: item,
					value: item,
				}))}
				selectedValue={searchItem.value}
				setSelectedValue={(value, type) => setSearchItem({ value, type })}
				title={title}
			/>
			<Collapsible
				collapsed={collapsed}
				onAnimationEnd={() => {
					console.log('anim', animationEnd);
					if (collapsed) {
						setAnimationEnd(false);
					} else {
						setAnimationEnd(true);
					}
				}}>
				<CollapsedContainer>
					{valuesForSearchList.length > 0 &&
						searchItem.type &&
						animationEnd && (
							<FlashList
								showsVerticalScrollIndicator={false}
								contentContainerStyle={{ paddingTop: 5 }}
								estimatedItemSize={30}
								data={valuesForSearchList}
								renderItem={({ item }) => (
									<SearchedValueButton
										onPress={() => {
											setSearchedVale(item);
										}}>
										<SearchedValueText>{item}</SearchedValueText>
									</SearchedValueButton>
								)}
							/>
						)}
				</CollapsedContainer>
			</Collapsible>
		</Animated.View>
	);
};

const style = StyleSheet.create({
	expandView: {},
});

const SearchedValueButton = styled.TouchableOpacity`
	background-color: #43b043;
	padding: 10px 5px;
	border-radius: 12px;
	margin-bottom: 5px;
`;

const CollapsedContainer = styled.View`
	padding-left: 10px;
	padding-right: 10px;
	height: 200px;
	border-width: 1px;
	border-radius: 12px;
	overflow: hidden;
	margin-top: 5px;
`;

const SearchedValueText = styled.Text`
	font-size: 14px;
	color: #fff;
`;
export default SearchFieldWithDropdown;
