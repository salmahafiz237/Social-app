import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { TimelineComponent } from './features/timeline/timeline.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},

    {path:'',component:AuthLayoutComponent,children:[
        {path:'login', component:LoginComponent},
        {path:'register', component:RegisterComponent},
        {path: 'forget-password', component:ForgetPasswordComponent}
    ]},

    {path:'', component:MainLayoutComponent, children:[
        {path:'profile', component: ProfileComponent},
        {path:'timeline', component:TimelineComponent},
        {path: 'notigication', component:NotificationsComponent},
        {path: 'change-password', component:ChangePasswordComponent}
    ]},

    {path:'not-found', component:NotFoundComponent},
    {path:'**', redirectTo:'not-found', pathMatch:'full'},
];
