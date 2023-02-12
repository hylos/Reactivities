import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';
import { format } from "date-fns";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    //Sorting Descending Order
    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b) => 
        a.date!.getTime() - b.date!.getTime());
    }

    //get activities grouped by the date
    get groupedActivities()
    {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
              const date = format(activity.date!, 'dd MMM yyyy');
              activities[date] = activities[date] ? [...activities[date], activity] : [activity];
              return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    //Functions

    //Load activities
    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            
                activities.forEach(activity => {
                    this.setActivity(activity);
                  });

                  this.setLoadingInitial(false);
             
        } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            
        }
    }

    //Load single activity
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        //check if we have avtivity in memory else request from API
        if(activity) {
            this.selectedActivity = activity
            return activity;
        }
        else{
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false);
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    //Loading Indicator flag
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    //create activity
    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();

        try {
            await agent.Activities.create(activity);
            runInAction(() =>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;

            })
        } catch (error) {
            console.log(error);
        }
    }

    //update activity
    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    //delete activity
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}

