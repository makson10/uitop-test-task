import type { TransitionProps } from "@mui/material/transitions";

export type SnackbarState = {
	open: boolean;
	Transition: React.ComponentType<
		TransitionProps & {
			children: React.ReactElement<any, any>;
		}
	>;
};
