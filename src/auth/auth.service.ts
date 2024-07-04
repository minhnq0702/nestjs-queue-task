import { AccountsService } from '@/shared/accounts/accounts.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly accSvc: AccountsService) {}

  // * login param can be email or account
  async authenticate(login: string, password: string): Promise<string> {
    if (!login || !password) throw new Error('Invalid login or password');

    const user = await this.accSvc.getAccount({ $or: [{ email: login }, { account: login }] });
    console.log(user);
    return '';
  }
}
