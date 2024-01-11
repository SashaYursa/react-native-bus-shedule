import {MONTH} from './constants';

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
