import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Image, ImageURISource, Text, View } from 'react-native';
import {
	Callout,
	CalloutPressEvent,
	LatLng,
	MapMarker as NativeMapMarker,
	Marker,
	CalloutSubview,
} from 'react-native-maps';
import styled from 'styled-components/native';

type Props = PropsWithChildren<{
	id: number;
	name: string;
	position: LatLng;
	isSelected?: boolean;
	setSelectedMarker?: (id: number) => void;
	removeSelectedMarker?: () => void;
}>;

const MapMarker = ({
	children,
	name,
	position,
	id,
	isSelected,
	setSelectedMarker,
	removeSelectedMarker,
}: Props) => {
	const markerRef = useRef<NativeMapMarker>(null);

	useEffect(() => {
		if (markerRef) {
			markerRef.current?.hideCallout();
		}
	}, [markerRef, isSelected]);

	const calloutAction = () => {
		if (setSelectedMarker && removeSelectedMarker) {
			if (isSelected) {
				removeSelectedMarker();
			} else {
				setSelectedMarker(id);
			}
		}
	};

	return (
		<Marker
			style={{ position: 'relative' }}
			title={name}
			identifier={String(id)}
			coordinate={position}
			draggable={false}
			ref={markerRef}
			tracksViewChanges={false}>
			<MarkerIconContainer>{children}</MarkerIconContainer>
			{typeof isSelected === 'boolean' && (
				<Callout
					onPress={calloutAction}
					style={{
						justifyContent: 'flex-end',
						height: 40,
					}}
					tooltip={true}>
					<StationName>{name}</StationName>
					<MarkerButton>
						<CalloutActionText>
							{isSelected ? 'Скасувати' : 'Перемістити точку'}
						</CalloutActionText>
					</MarkerButton>
				</Callout>
			)}
		</Marker>
	);
};
const MarkerButton = styled.View`
	background-color: green;
	align-items: center;
	justify-content: center;
	padding-top: 3px;
	padding-bottom: 3px;
	padding-left: 5px;
	padding-right: 5px;
	border-radius: 12px;
	width: 200px;
`;

const MarkerIconContainer = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: flex-end;
	height: 30px;
`;

const StationName = styled.Text`
	font-size: 14px;
	color: #000;
	font-weight: 700;
`;
const CalloutActionText = styled.Text`
	color: #fff;
`;

export default MapMarker;
