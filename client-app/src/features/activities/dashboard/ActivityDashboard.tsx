import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid} from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';


function ActivityDashboard(){
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;
    

useEffect(() => {
 if(activityRegistry.size <= 1) loadActivities();
}, [loadActivities, activityRegistry.size])


if(activityStore.loadingInitial) return <LoadingComponent content='Loading App' />

    return(
        //semantic has 16 grid columns
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Actvity filters</h2>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);