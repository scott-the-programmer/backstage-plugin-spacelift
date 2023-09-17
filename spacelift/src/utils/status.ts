export const getStatusColor = (status: string): string => {
  let backgroundColor: string;

  switch (status) {
    case 'FINISHED':
      backgroundColor = '#00d474';
      break;
    case 'FAILED':
    case 'DISCARDED':
    case 'STOPPED':
      backgroundColor = '#fc2c03';
      break;
    case 'NONE':
    case '':
      backgroundColor = 'grey';
      break;
    case 'INITIALIZING':
    case 'PLANNING':
    case 'UNCONFIRMED':
    case 'CONFIRMED':
    case 'APPLYING':
    case 'DESTROYING':
    case 'PREPARING':
    case 'PREPARING_APPLY':
    default:
      backgroundColor = '#fcca03';
      break;
  }

  return backgroundColor;
};
