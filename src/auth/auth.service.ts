import { SignPayloadDto } from '@/dto';
import { AccountDoc } from '@/entities/account.entity';
import { WrongLoginInfo } from '@/entities/error.entity';
import { AccountsService } from '@/modules/accounts/accounts.service';
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
    if (!user) {
      throw new WrongLoginInfo('Email / Account not found');
    }

    const hashedPassword = await this.accSvc.hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new WrongLoginInfo('Wrong passwod');
    }

    const token = await this.sign_JWT({
      id: user._id.toString(),
      email: user.email,
      account: user.account,
      role: user.role,
    });

    return token;
  }

  async getProfile(accountInfo: SignPayloadDto): Promise<AccountDoc> {
    return this.accSvc.getAccount({ _id: accountInfo.id });
  }

  /**
   * Sign JWT Token
   * @param signPayload: sign payload data
   * @returns
   */
  private async sign_JWT(signPayload: SignPayloadDto): Promise<string> {
    return this.jwtSvc.signAsync(signPayload);
  }

  async verify_JWT(token: string): Promise<[SignPayloadDto | null, boolean]> {
    return this.jwtSvc
      .verifyAsync<SignPayloadDto>(token)
      .then((res) => {
        return [res, true] satisfies [SignPayloadDto, boolean];
      })
      .catch(() => [null, false]);
  }
}
