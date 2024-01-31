import { waypoint } from '../screens/Route';
import { MONTH } from './constants';

export const transformDate = (date: number): string => {
	if (date < 10) {
		return '0' + String(date);
	}
	return String(date);
};

export const formattingDate = (date: Date): string => {
	return (
		date.getDate() +
		' ' +
		MONTH[date.getMonth()] +
		' ' +
		transformDate(date.getHours()) +
		':' +
		transformDate(date.getMinutes())
	); // e.g. 11 січня 12.55
};
export const formattingTime = (date: Date): string => {
	return (
		transformDate(date.getHours()) + ':' + transformDate(date.getMinutes())
	); // e.g. 12.55
};

export const getTicketsStatusColor = (ticketsStatus: string): string => {
	let cardBackgroud = 'rgba(109, 231, 95, 0.5)'; // default for 'У продажі'
	if (ticketsStatus.includes('платформ'))
		cardBackgroud = 'rgba(26, 255, 0, 0.5)';
	else if (ticketsStatus.includes('Тимчасово не курсує'))
		cardBackgroud = 'rgba(134, 134, 134, 0.6)';
	else if (ticketsStatus.includes('нено'))
		cardBackgroud = 'rgba(230, 13, 13, 0.4)';
	else if (ticketsStatus.includes('продан'))
		cardBackgroud = 'rgba(230, 13, 13, 0.4)';
	else if (ticketsStatus.includes('Затримка'))
		cardBackgroud = 'rgba(169, 169, 1, 0.4)';
	else if (ticketsStatus.includes('По прибуттю'))
		cardBackgroud = 'rgba(108, 231, 95, 0.5)';
	return cardBackgroud;
};

export const getCloser = (value: any, checkOne: number, checkTwo: number) =>
	Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

export const sliceWaypointsArrayToConstLength = (
	arr: waypoint[],
	maxPoints: number,
) => {
	let res = [...arr];
	if (res.length === 0) {
		return [];
	}
	if (res.length < maxPoints) {
		return arr;
	}
	if (res.length > maxPoints) {
		while (res.length > maxPoints) {
			// console.log(res, 'res');
			console.log(res.length, 'len');
			const needToRemove = res.length - maxPoints;
			let removeEvery = Math.ceil(res.length / needToRemove);
			// console.log(removeEvery, 'remove');
			let lastRemoved = removeEvery;
			res = res.filter((item: any, index: number) => {
				if (index + 1 === lastRemoved) {
					lastRemoved += removeEvery;
					return false;
				}
				return true;
			});
		}
		console.log(arr, 'old');
		console.log(res, 'new');
		return res;
	}
	return [];
};
