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
import { authGuard } from './core/auth/guard/auth-guard';
import { guestGuard } from './core/auth/guard/guest-guard';
import { DetailsComponent } from './features/details/details.component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},

    {path:'',canActivate:[guestGuard] ,component:AuthLayoutComponent,children:[
        {path:'login', component:LoginComponent, title:"Login Page"},
        {path:'register', component:RegisterComponent, title:"Register Page"},
        {path: 'forget-password', component:ForgetPasswordComponent, title:"Forget Password"}
    ]},

    {path:'', component:MainLayoutComponent, canActivate:[authGuard], children:[
        {path:'profile', component: ProfileComponent, title:"Profile Page"},
        {path:'timeline', component:TimelineComponent, title:"Home Page"},
        {path: 'notification', component:NotificationsComponent, title:"Notifications Page"},
        {path: 'change-password', component:ChangePasswordComponent, title:"Change Password"},
        {path: 'details/:id', component: DetailsComponent, title:"Details"}
    ]},

    {path:'not-found', component:NotFoundComponent},
    {path:'**', redirectTo:'not-found', pathMatch:'full', title:"Not-Found Page"},
];
