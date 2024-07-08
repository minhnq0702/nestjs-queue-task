import { SignPayloadDto } from '@/dto';
import { AccountNotFound } from '@/entities/error.entity';
import { AccountsService } from '@/shared/accounts/accounts.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accSvc: AccountsService,
    private readonly jwtSvc: JwtService,
  ) {}

  /**
   *
   * @param login can be email or account
   * @param password hashed password
   * @returns JWT Token
   */
  async authenticate(login: string, password: string): Promise<string> {
    // TODO change Error type here. Change to MyCustomError
    if (!login || !password) throw new Error('Invalid login or password');

    const user = await this.accSvc.getAccount({ $or: [{ email: login }, { account: login }] });
    console.log(user);
    if (!user) {
      throw new AccountNotFound();
    }
    return '';
  }

  /**
   * Sign JWT Token
   * @param signPayload: sign payload data
   * @returns
   */
  private async sign_JWT(signPayload: SignPayloadDto): Promise<string> {
    return this.jwtSvc.signAsync(signPayload);
  }
}
