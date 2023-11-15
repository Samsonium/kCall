import {
    BadRequestException,
    Controller, Delete,
    Get,
    Patch,
    Post, Query,
    UnauthorizedException
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {ErrorBodyDto} from './dto/ErrorBody.dto';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
    //
}
