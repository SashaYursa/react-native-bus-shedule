import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
type Props = {
	updateFilter: (val: string) => void;
	setIsFocused: (isFocused: boolean) => void;
	isFocused: boolean;
};

const Search: React.FC<Props> = ({
	updateFilter,
	setIsFocused,
	isFocused,
}: Props) => {
	const [value, setValue] = useState('');
	const inputRef = useRef<TextInput>(null);
	useLayoutEffect(() => {
		updateFilter(value);
	}, [value]);

	useEffect(() => {
		if (!isFocused) {
			inputRef.current?.blur();
		}
	}, [isFocused]);

	const clearInput = () => {
		setValue('');
	};

	return (
		<SearchBar>
			<TextInput
				style={style.searchInput}
				onFocus={() => {
					setIsFocused(true);
				}}
				onBlur={() => {
					setIsFocused(false);
				}}
				placeholder="Пошук"
				value={value}
				ref={inputRef}
				onChangeText={setValue}
			/>
			{value && (
				<ClearInputValue onPress={clearInput}>
					<Icon size={20} name="backspace" />
				</ClearInputValue>
			)}
		</SearchBar>
	);
};

const style = StyleSheet.create({
	searchInput: {
		padding: 10,
		fontSize: 16,
		backgroundColor: '#eaeaea',
		borderRadius: 12,
		flex: 1,
	},
});

const SearchBar = styled.View`
	flex-direction: row;
	width: 100%;
	align-items: center;
	justify-content: space-between;
	padding: 5px;
	height: 60px;
	background-color: #fff;
`;
const ClearInputValue = styled.TouchableOpacity`
	padding: 10px;
	border-radius: 12px;
	background-color: #eaeaea;
	margin-left: 10px;
	height: 100%;
	align-items: center;
	flex-direction: row;
`;

export default Search;
