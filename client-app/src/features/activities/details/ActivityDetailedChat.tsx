import { Field, FieldProps, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }

        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, activityId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
            <Formik onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}>
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form' >
                                {/* This code works! - just needed to redesign and allow user to send comments just 
                                by pressing enter in the text filed!
                                <MyTextArea placeholder='Add Comment' name='body' rows={2} />
                                <Button
                                    loading={isSubmitting}
                                    disabled={isSubmitting || !isValid}
                                    content='Add Reply'
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                    type='submit'
                                    floated='right'
                                /> */}
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{position: 'relative'}}>
                                            <Loader active={isSubmitting} />
                                            <textarea placeholder='Enter your comment (Enter to submit, SHIFT + ENTER for a new line)'
                                                    rows={2}
                                                    {...props.field}
                                                    onKeyPress={e => {
                                                        if(e.key === 'Enter' && e.shiftKey){
                                                            return;
                                                        }

                                                        if(e.key === 'Enter' && !e.shiftKey){
                                                            e.preventDefault();
                                                            isValid && handleSubmit();
                                                        }
                                                    }} />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}


                </Comment.Group>
            </Segment>
        </>

    )
})