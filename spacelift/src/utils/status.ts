export const getStatusColor = (status: string): string => {
  let backgroundColor: string;

  switch (status) {
    case 'FINISHED':
      backgroundColor = 'green';
      break;
    case 'FAILED':
    case 'DISCARDED':
    case 'STOPPED':
      backgroundColor = 'red';
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
      backgroundColor = 'yellow';
      break;
  }

  return backgroundColor;
};
