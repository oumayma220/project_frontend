import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SuccessComponent } from './success/success.component';
import { RequestResetCodeComponent } from './request-reset-code/request-reset-code.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ActivateComponent } from './activate/activate.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { adminGuard } from './Guard/admin.guard';
import { notLoggedInGuard } from './Guard/not-logged-in.guard';
import { ClienthomeComponent } from './clienthome/clienthome.component';
import { employeeGuard } from './Guard/employee.guard';
import { CrudemployeeComponent } from './crudemployee/crudemployee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { TiersFormComponent } from './tiers-form/tiers-form.component';
import { HelpMappingComponent } from './help-mapping/help-mapping.component';
import { TiersComponent } from './tiers/tiers.component';
import { UpdateTiersComponent } from './update-tiers/update-tiers.component';
import { ConfigListComponent } from './config-list/config-list.component';
import { AjoutConfigurationComponent } from './ajout-configuration/ajout-configuration.component';
import { AjoutApimethodComponent } from './ajout-apimethod/ajout-apimethod.component';
import { AjoutMappingComponent } from './ajout-mapping/ajout-mapping.component';
import { TestComponent } from './test/test.component';
import { UpdateConfigComponent } from './update-config/update-config.component';
import { UpdateMethodComponent } from './update-method/update-method.component';
import { UpdateMappingComponent } from './update-mapping/update-mapping.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ListTiersComponent } from './list-tiers/list-tiers.component';
import { ProduitsTiersComponent } from './produits-tiers/produits-tiers.component';
import { JsonPathViewerComponent } from './json-path-viewer/json-path-viewer.component';

export const routes: Routes = [
{
    path:'home',
    title: 'Home',
    component: HomeComponent,
},
{
    path:'',
    redirectTo:'/home',
    pathMatch: 'full'
},
{
    path:'login',
    title:'Login',
    component: LoginComponent,
    canActivate: [notLoggedInGuard],  

},
{
    path:'success',
    title:'Success',
    component: SuccessComponent,
    canActivate: [employeeGuard],
    children: [
        { path: 'crudemployee', component: CrudemployeeComponent , canActivate: [adminGuard] },
        { path:'addemployee', component:AddEmployeeComponent,canActivate: [adminGuard]},
        { path:'editemployee', component:EditEmployeeComponent,canActivate: [adminGuard]},
        { path:'tiersform', component:TiersFormComponent,canActivate: [adminGuard]},
        { path:'helpmapping', component:HelpMappingComponent, canActivate: [adminGuard]},
        { path:'tiers', component:TiersComponent, canActivate: [adminGuard]},
        { path:'updatetiers', component:UpdateTiersComponent ,canActivate: [adminGuard]},
        { path: 'configlist/:tiersId', component:ConfigListComponent, canActivate: [adminGuard]},
        { path: 'ajoutconfig/:tiersId', component:AjoutConfigurationComponent,canActivate: [adminGuard]},
        { path: 'ajoutapimethod/:configId', component:AjoutApimethodComponent,canActivate: [adminGuard]},
        { path: 'ajoutmapping/:methodId', component:AjoutMappingComponent,canActivate: [adminGuard]},
        { path: 'test', component:TestComponent,canActivate: [adminGuard]},    
        { path: 'updateconfig', component:UpdateConfigComponent,canActivate: [adminGuard]},   
        { path: 'updatemethod', component:UpdateMethodComponent,canActivate: [adminGuard]},
        { path: 'updatemapping', component:UpdateMappingComponent,canActivate: [adminGuard]},
        { path: 'productlist', component:ProductListComponent},
        { path: 'list-tiers', component:ListTiersComponent},
        { path: 'produits-tiers/:tiersId', component:ProduitsTiersComponent},
        { path: 'jsonpathviewer', component:JsonPathViewerComponent,canActivate: [adminGuard]}
      
         
    ]  

},
{
    path:'requestresetcode',
    title:'requestresetcode',
    component: RequestResetCodeComponent,
    canActivate: [notLoggedInGuard],  

},
{
    path:'resetpassword',
    title:'Resetpassword',
    component:ResetPasswordComponent,
    canActivate: [notLoggedInGuard],  

},
{
    path:'registeruser',
    title:'Registeruser',
    component:RegisterUserComponent,
    canActivate: [notLoggedInGuard],  

},
{
    path:'activate',
    title:'Activate',
    component:ActivateComponent,
    canActivate: [notLoggedInGuard],  

},
{
    path:'addemployee',
    title:'AddEmployee',
    component:AddEmployeeComponent,
    canActivate: [adminGuard],  

},
{
    path:'adminhome',
    title:'AdminHome',
    component:AdminhomeComponent,
    canActivate: [adminGuard],
   
},
{
    path:'clienthome',
    title:'ClientHome',
    component:ClienthomeComponent,
},
// {
//     path:'crudemployee',
//     title:'Crudemployee',
//     component:CrudemployeeComponent,
// },


];
