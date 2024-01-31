import React, { useEffect, useRef } from 'react';
import { ImageURISource, Text, View } from 'react-native';
import {
	Callout,
	CalloutPressEvent,
	LatLng,
	MapMarker as NativeMapMarker,
	Marker,
} from 'react-native-maps';
import styled from 'styled-components/native';

type Props = {
	isSelected: boolean;
	name: string;
	position: LatLng;
	id: number;
	icon: ImageURISource;
	setSelectedMarker: (id: number) => void;
	removeSelectedMarker: () => void;
};

const MapMarker = ({
	isSelected,
	name,
	position,
	id,
	icon,
	setSelectedMarker,
	removeSelectedMarker,
}: Props) => {
	const markerRef = useRef<NativeMapMarker>(null);

	useEffect(() => {
		if (markerRef) {
			markerRef.current?.hideCallout();
		}
	}, [markerRef, isSelected]);

	const calloutAction = (e: CalloutPressEvent) => {
		if (isSelected) {
			removeSelectedMarker();
		} else {
			setSelectedMarker(id);
		}
	};

	return (
		<Marker
			title={name}
			identifier={String(id)}
			coordinate={position}
			draggable={false}
			ref={markerRef}
			tracksViewChanges={false}
			icon={!isSelected ? icon : 0}>
			<Callout
				onPress={e => {
					calloutAction(e);
				}}
				tooltip={true}>
				<Text style={{ fontSize: 14, color: '#000', fontWeight: '700' }}>
					{name}
				</Text>
				<MarkerButton>
					<Text style={{ color: '#fff' }}>
						{isSelected ? 'Скасувати' : 'Перемістити точку'}
					</Text>
				</MarkerButton>
			</Callout>
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

export default MapMarker;
