import { Button, IconButton, Snackbar as MuiSnackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
	open: boolean;
	handleUndo: () => void;
	handleClose: () => void;
}

export const Snackbar = ({ open, handleUndo, handleClose }: Props) => (
	<MuiSnackbar
		open={open}
		autoHideDuration={5000}
		onClose={handleClose}
		message="Task completed"
		anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
		action={
			<>
				<Button
					color="secondary"
					size="small"
					onClick={handleUndo}
					sx={{ color: '#fff', fontWeight: 'bold' }}>
					UNDO
				</Button>
				<IconButton
					size="small"
					aria-label="close"
					color="inherit"
					onClick={handleClose}>
					<CloseIcon fontSize="small" />
				</IconButton>
			</>
		}
		slotProps={{
			clickAwayListener: {
				onClickAway: (event: any) => {
					event.defaultMuiPrevented = true;
				},
			},
		}}
	/>
);
