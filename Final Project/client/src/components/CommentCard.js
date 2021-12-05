import { Card, Typography, Stack } from '@mui/material';

/*
    This is one of the cards in our expanded accordian details view that
    displays the comments on a list.
*/
export default function CommentCard(props) {
    const { list } = props;

    return (
        <Card sx={{ flex: 8, overflow: "auto", padding: 1 }}>
            <Stack spacing={1}>
                {
                    list.comments.map((comment) => (
                        <Card padding={2}>
                            <Typography padding={1} variant="caption">{comment.username}</Typography>
                            <Typography padding={1}> {comment.comment}</Typography>
                        </Card>
                    ))
                }
            </Stack>
        </Card>
    )
}

