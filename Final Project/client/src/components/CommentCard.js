import { Card, Typography, Stack } from '@mui/material';

/*
    This is one of the cards in our expanded accordian details view that
    displays the comments on a list.
*/
export default function CommentCard(props) {
    const { list } = props;

    return (
        <Card sx={{ flex: 8, overflow: "auto" }}>
            <Stack spacing={1}>
                {
                    list.comments.map((comment) => (
                        <Card padding={1}>
                            <Typography>{comment}</Typography>
                        </Card>
                    ))
                }
            </Stack>
        </Card>
    )
}

