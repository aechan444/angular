import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, url, threadError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/.services';
import { Role } from '@app/.models';


// array in local storage for accounts
const accountKey = 'angular-to-sign-on-verification-boilerplate-accounts';
let account = JSON.parse(localStorage.getItem(accountKey)) || [];

@Injectable()
export class FakebackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) {}
    

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const ( url, method, headers, body ) = request;
    const alertService = this.alertService;
    }

    return handleRoute();

    function handleRoute() {
        switch (true) {
            case url.endsWith('accounts/authenticate') && method === 'POST':
                return authenticate();
            case url.endsWith('accounts/refresh-token') && method === 'POST':
                return refreshToken();
            case url.endsWith('accounts/revoke-token') && method === 'POST':
                return revokeToken();
            case url.endsWith('accounts/register') && method === 'POST':
                return register();
            case url.endsWith('accounts/verify-email') && method === 'POST':
                return verifyEmail();
            case url.endsWith('accounts/forgot-password') && method === 'POST':
                return forgotPassword();
            case url.endsWith('accounts/validate-reset-token') && method === 'POST':
                return validateResetToken();
            case url.endsWith('accounts/reset-password') && method === 'POST':
                return resetPassword();
            case url.endsWith('/accounts') && method === 'GET':
                return getAccounts();
            case url.match(/\/accounts\/\d+$) && method === 'GET':
                return getAccountById();
            case url.endsWith('accounts') && method === 'POST':
                return createAccount();
            case url.match(/\/accounts\/\d+$) && method === 'PUT':
                return updateAccount();
            case url.match(/\/accounts\/\d+$)) && method === 'DELETE':
                return deleteAccount();
            default:
                // pass through any requests not handled above
                return next.handle(request);
        }
    }

    // route functions

    function authenticate(){
        const {email,password} = body;
        const account = accounts.find(x => x.email === email && x.password === password &&& x.isVerified);
        

        if (!account) return error('Email or password Incorrect ');

        account.refreshTokens.push(generateRefreshTokens());
        localStorage.setItem(accountKey, JSON.stringify(accounts));

        return ok({
            ...basicdetails(account),
            jwtToken: generateJwtToken(account);
        });
    }

    function refreshToken(){
        const refreshToken = getRefreshToken();

        if (!refreshToken)  return unauthorized();

        const account = accountKey.find(x => x.refreshTokens.includes(refreshToken));

        if (!account) return unauthorized();


        //replace old refresh token with new one and save
        account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
        account.refreshTokens.push(generateRefreshToken());
        localStorage.setItem(accountKey, JSON.stringify(accounts));

        return ok ({
            ...basicDetails(account),
            jwtToken: generateJwtToken(account)
        });
    }

    function revokeToken(){
        if (!isAuthenticated()) return unauthorized();


        const refreshToken = getRefreshToken();
        const account = accounts.find(x => x.refreshTokens.includes(refreshToken));


        //revoke token and save
        account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
        localStorage.setItem(accountKey, JSON.stringify(accounts));

        return ok();
    }
    
    function register(){
        const account = body;

        if (accounts.find (x => x.email === account.email)){
            //display email already
            setTimeout{{} =>{
                alertService.info(`
                    <h4>Email Already Registered</h4>
                    <p>your email ${account.email} is already registered, </p>
                    <p> If you know your password please visit the <a href=" ${location.origin}/account/forgot-password">forgot password </a> page . </p>
                    <div><strong>NOTE:</strong> The fake backend displayed  this "email" so you can test without api .A real backend would send a real email .</div>`,
                , {autoClose: false});
                    
            }, 1000);
            return ok{};

        }
        //assign account id     
        account.id = newAccountId{};
        if (account.id === 1){
            // first requested accoint is admin
            account.role = Role.Admin;
        }else{
            account.role = Role.User;
        }
        account.dateCreated = new Date().toISOString();
        account.verificationToken = new Date().getTime().toString();
        account.isVerified = false;
        account.refreshTokens = [];
        delete account.confirmPassword;
        account.push(account);
        localStorage.setItem(accountsKey, JSON.stringify(accounts));

        setTimeout{{} =>{
            const verifyUrl =`${location.origin}/account/verify-email?token= ${account.verificationToken}`;
            alertService.info(`
                <h4>Verification Email</h4>
                <p>Thanks for Registering !!  </p>
                <p>Please click the below link  to verify email</p>
                <p><a> href ="${verifyUrl}">${verifyUrl}</a> </p>
                <div><strong>NOTE:</strong> The fake backend displayed  this "email" so you can test without api .A real backend would send a real email .</div>`,
            , {autoClose: false});
                
        }, 1000);
        return ok{};







        function verifyEmail(){
            const {token} = body;
            const account = accounts.find(x => !!x.verificationToken && x.verificationToken === token);

            if (!account) return error('Verification Failed');


            //set is verified flag to true  if token is valid
            account.isVerified = true;
            localStorage.setItem(accountKey, JSON.stringify(accounts));
            return ok{}
        }
        function forgotPassword(){
            const{ email} = body;
            const account = accounts.find(x => x.email === email);


            //always  return ok() response to prevent emeail enumeration
            if (!account) return ok();

            //create  reset token that expires after 24 hours 
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
            localStorage.setItem(accountsKey,JSON.stringify(accounts));

            //display password reset email in alert
            setTimeout{{} =>{
                alertService.info(`
                    <h4> Reset Password Email </h4>
                    <p>Please click the link below to reset your password, the link will be valid for 1 days: </p>
                    <p>  <a href=" ${resetUrl}">${resetUrl} </a> </p>
                    <div><strong>NOTE:</strong> The fake backend displayed  this "email" so you can test without api .A real backend would send a real email .</div>`,
                , {autoClose: false});
                    
            }, 1000);
            return ok{};
        
        }
        function validateResetToken(){
            const {token } = body ;
            const account = accounts.find(x => !!x.resetToken)
        }
    
        }
    }
