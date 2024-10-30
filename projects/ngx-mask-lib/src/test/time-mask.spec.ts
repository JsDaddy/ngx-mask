import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TestMaskComponent } from './utils/test-component.component';
import { equal } from './utils/test-functions.component';
import { provideNgxMask } from '../lib/ngx-mask.providers';
import { NgxMaskDirective } from '../lib/ngx-mask.directive';

describe('Directive: Mask (Time)', () => {
    let fixture: ComponentFixture<TestMaskComponent>;
    let component: TestMaskComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestMaskComponent],
            imports: [ReactiveFormsModule, NgxMaskDirective],
            providers: [provideNgxMask()],
        });
        fixture = TestBed.createComponent(TestMaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('empty', () => {
        component.mask = 'Hh:m0:s0';
        equal('', '', fixture);
    });

    it('Hours', () => {
        component.mask = 'Hh:m0:s0';
        equal('20', '20', fixture);
    });

    it('Hours', () => {
        component.mask = 'Hh:m0:s0';
        equal('03', '03', fixture);
    });

    it('Hours', () => {
        component.mask = 'Hh:m0:s0';
        equal('730', '7:30', fixture);
    });

    it('Hours', () => {
        component.showMaskTyped = true;
        component.mask = 'Hh:m0';
        equal('3__:__', '3_:__', fixture);
        equal('33:__', '3:3_', fixture);
        equal('33__:__', '3:3_', fixture);
    });

    it('Hours (lead zero)', () => {
        component.showMaskTyped = true;
        component.leadZeroDateTime = true;
        component.mask = 'Hh:m0';
        equal('3__:__', '03:__', fixture);
    });

    it('Minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('1212', '12:12', fixture);
    });

    it('Minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('1207', '12:07', fixture);
    });

    it('Minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('127', '12:7', fixture);
    });

    it('Minutes (lead zero)', () => {
        component.leadZeroDateTime = true;
        component.mask = 'Hh:m0:s0';
        equal('127', '12:07', fixture);
    });

    it('Hours and minutes', () => {
        component.mask = 'Hh:m0:s0';
        equal('7712', '7:7:12', fixture);
    });

    it('Seconds (lead zero)', () => {
        component.leadZeroDateTime = true;
        component.mask = 'Hh:m0:s0';
        equal('777', '07:07:07', fixture);
    });

    it('Date', () => {
        component.mask = 'd0/M0/0000';
        equal('321234', '3/2/1234', fixture);
    });

    it('Date', () => {
        component.mask = 'd0/M0/0000';
        equal('3113123', '31/1/3123', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('413234', '4/1/3234', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('01011234', '01/01/1234', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('10101234', '10/10/1234', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('2322123', '23/2/2123', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('23122123', '23/12/2123', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('0314123', '03/1/4123', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('0314123', '03/1/4123', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('414123', '4/1/4123', fixture);
    });

    it('Date ', () => {
        component.mask = 'd0/M0/0000';
        equal('4121234', '4/12/1234', fixture);
    });

    it('Date (day lead zero)', () => {
        component.leadZeroDateTime = true;
        component.mask = 'd0/M0/0000';
        equal('4121234', '04/12/1234', fixture);
    });

    it('Date (month lead zero)', () => {
        component.leadZeroDateTime = true;
        component.mask = 'd0/M0/0000';
        equal('421234', '04/02/1234', fixture);
    });

    it('Date (years, month, day , lead zero', () => {
        component.mask = '0000.M0.d0';
        component.leadZeroDateTime = true;
        equal('9999999', '9999.09.09', fixture);
        equal('8888888', '8888.08.08', fixture);
        equal('7777777', '7777.07.07', fixture);
        equal('6666666', '6666.06.06', fixture);
        equal('5555555', '5555.05.05', fixture);
        equal('4444444', '4444.04.04', fixture);
    });

    it('Date (years, month, day , lead zero', () => {
        component.mask = '0000/M0/d0';
        component.leadZeroDateTime = true;
        equal('9999999', '9999/09/09', fixture);
        equal('8888888', '8888/08/08', fixture);
        equal('7777777', '7777/07/07', fixture);
        equal('6666666', '6666/06/06', fixture);
        equal('5555555', '5555/05/05', fixture);
        equal('4444444', '4444/04/04', fixture);
    });

    it('Date (years, month, day mask 0000.M0.d0', () => {
        component.mask = '0000.M0.d0';
        equal('999999', '9999.9.9', fixture);
        equal('888888', '8888.8.8', fixture);
        equal('777777', '7777.7.7', fixture);
        equal('666666', '6666.6.6', fixture);
        equal('555555', '5555.5.5', fixture);
        equal('444444', '4444.4.4', fixture);
        equal('333333', '3333.3.3', fixture);
        equal('2222222', '2222.2.22', fixture);
        equal('11111111', '1111.11.11', fixture);
        equal('202344', '2023.4.4', fixture);
    });
    it('Date (d0-M0-0000', () => {
        component.mask = 'd0-M0-0000';
        equal('999999', '9-9-9999', fixture);
        equal('888888', '8-8-8888', fixture);
        equal('777777', '7-7-7777', fixture);
        equal('666666', '6-6-6666', fixture);
        equal('555555', '5-5-5555', fixture);
        equal('444444', '4-4-4444', fixture);
        equal('333333', '3-3-3333', fixture);
        equal('2222222', '22-2-2222', fixture);
        equal('11111111', '11-11-1111', fixture);
        equal('20232023', '20-2-3202', fixture);
    });

    it('Date (d0/M0:0000', () => {
        component.mask = 'd0/M0:0000';
        equal('999999', '9/9:9999', fixture);
        equal('888888', '8/8:8888', fixture);
        equal('777777', '7/7:7777', fixture);
        equal('666666', '6/6:6666', fixture);
        equal('555555', '5/5:5555', fixture);
        equal('444444', '4/4:4444', fixture);
        equal('333333', '3/3:3333', fixture);
        equal('2222222', '22/2:2222', fixture);
        equal('11111111', '11/11:1111', fixture);
        equal('20232023', '20/2:3202', fixture);
    });

    it('Date (m0/d0/0000', () => {
        component.mask = 'm0/d0/0000';
        equal('999999', '9/9/9999', fixture);
        equal('888888', '8/8/8888', fixture);
        equal('777777', '7/7/7777', fixture);
        equal('666666', '6/6/6666', fixture);
        equal('5555555', '55/5/5555', fixture);
        equal('4444444', '44/4/4444', fixture);
        equal('3333333', '33/3/3333', fixture);
        equal('22222222', '22/22/2222', fixture);
        equal('11111111', '11/11/1111', fixture);
        equal('20232023', '20/2/3202', fixture);
    });

    it('Date (0000-M0-d0', () => {
        component.mask = '0000-M0-d0';
        equal('999999', '9999-9-9', fixture);
        equal('888888', '8888-8-8', fixture);
        equal('777777', '7777-7-7', fixture);
        equal('666666', '6666-6-6', fixture);
        equal('555555', '5555-5-5', fixture);
        equal('444444', '4444-4-4', fixture);
        equal('333333', '3333-3-3', fixture);
        equal('2222222', '2222-2-22', fixture);
        equal('11111111', '1111-11-11', fixture);
    });

    it('Date (M0/d0/0000', () => {
        component.mask = 'M0/d0/0000';
        equal('999999', '9/9/9999', fixture);
        equal('888888', '8/8/8888', fixture);
        equal('777777', '7/7/7777', fixture);
        equal('666666', '6/6/6666', fixture);
        equal('555555', '5/5/5555', fixture);
        equal('444444', '4/4/4444', fixture);
        equal('333333', '3/3/3333', fixture);
        equal('2222222', '2/22/2222', fixture);
        equal('11111111', '11/11/1111', fixture);
    });

    it('Date (M0+d0+0000', () => {
        component.mask = 'M0+d0+0000';
        equal('999999', '9+9+9999', fixture);
        equal('888888', '8+8+8888', fixture);
        equal('777777', '7+7+7777', fixture);
        equal('666666', '6+6+6666', fixture);
        equal('555555', '5+5+5555', fixture);
        equal('444444', '4+4+4444', fixture);
        equal('333333', '3+3+3333', fixture);
        equal('2222222', '2+22+2222', fixture);
        equal('11111111', '11+11+1111', fixture);
    });

    it('Date (M0@d0@0000', () => {
        component.mask = 'M0@d0@0000';
        equal('999999', '9@9@9999', fixture);
        equal('888888', '8@8@8888', fixture);
        equal('777777', '7@7@7777', fixture);
        equal('666666', '6@6@6666', fixture);
        equal('555555', '5@5@5555', fixture);
        equal('444444', '4@4@4444', fixture);
        equal('333333', '3@3@3333', fixture);
        equal('2222222', '2@22@2222', fixture);
        equal('11111111', '11@11@1111', fixture);
    });

    it('Date (M0@d0/0000', () => {
        component.mask = 'M0@d0/0000';
        equal('999999', '9@9/9999', fixture);
        equal('888888', '8@8/8888', fixture);
        equal('777777', '7@7/7777', fixture);
        equal('666666', '6@6/6666', fixture);
        equal('555555', '5@5/5555', fixture);
        equal('444444', '4@4/4444', fixture);
        equal('333333', '3@3/3333', fixture);
        equal('2222222', '2@22/2222', fixture);
        equal('11111111', '11@11/1111', fixture);
    });

    it('Date (M0:d0/0000', () => {
        component.mask = 'M0:d0/0000';
        equal('999999', '9:9/9999', fixture);
        equal('888888', '8:8/8888', fixture);
        equal('777777', '7:7/7777', fixture);
        equal('666666', '6:6/6666', fixture);
        equal('555555', '5:5/5555', fixture);
        equal('444444', '4:4/4444', fixture);
        equal('333333', '3:3/3333', fixture);
        equal('2222222', '2:22/2222', fixture);
        equal('11111111', '11:11/1111', fixture);
    });

    it('Date (M0-d0-0000', () => {
        component.mask = 'M0-d0-0000';
        equal('999999', '9-9-9999', fixture);
        equal('888888', '8-8-8888', fixture);
        equal('777777', '7-7-7777', fixture);
        equal('666666', '6-6-6666', fixture);
        equal('555555', '5-5-5555', fixture);
        equal('444444', '4-4-4444', fixture);
        equal('333333', '3-3-3333', fixture);
        equal('2222222', '2-22-2222', fixture);
        equal('11111111', '11-11-1111', fixture);
    });

    it('Date (M0.d0.0000', () => {
        component.mask = 'M0.d0.0000';
        equal('999999', '9.9.9999', fixture);
        equal('888888', '8.8.8888', fixture);
        equal('777777', '7.7.7777', fixture);
        equal('666666', '6.6.6666', fixture);
        equal('555555', '5.5.5555', fixture);
        equal('444444', '4.4.4444', fixture);
        equal('333333', '3.3.3333', fixture);
        equal('2222222', '2.22.2222', fixture);
        equal('11111111', '11.11.1111', fixture);
    });

    it('Date (d0.M0.0000 Hh:m0:s0', () => {
        component.mask = 'd0.M0.0000 Hh:m0:s0';
        equal('992023999', '9.9.2023 9:9:9', fixture);
        equal('882023292030', '8.8.2023 2:9:20', fixture);
        equal('11111111 2420', '11.11.1111 2:42:0', fixture);
        equal('31122023 235049', '31.12.2023 23:50:49', fixture);
        equal('11119999 242020', '11.11.9999 2:42:02', fixture);
        equal('1199999 232020', '11.9.9999 23:20:20', fixture);
    });

    it('Date (d0.M0.0000 Hh:m0 - Hh:m0', () => {
        component.mask = 'd0.M0.0000 Hh:m0 - Hh:m0';
        equal('11111111 1111 1111', '11.11.1111 11:11 - 11:11', fixture);
        equal('31122023 2359 1211', '31.12.2023 23:59 - 12:11', fixture);
        equal('1223333 29 299', '12.2.3333 2:9 - 2:9', fixture);
        equal('992023999', '9.9.2023 9:9 - 9', fixture);
        equal('992023999', '9.9.2023 9:9 - 9', fixture);
        equal('882023292030', '8.8.2023 2:9 - 20:30', fixture);
        equal('11111111 2422920', '11.11.1111 2:42 - 2:9', fixture);
        equal('11119999 242022420', '11.11.9999 2:42 - 02:24', fixture);
    });

    it('Date (Hh:m0 apm=true', () => {
        component.mask = 'Hh:m0';
        component.apm = true;
        equal('1', '1', fixture);
        equal('11', '11', fixture);
        equal('12', '12', fixture);
        equal('13', '1:3', fixture);
        equal('15', '1:5', fixture);
        equal('16', '1:6', fixture);
        equal('17', '1:7', fixture);
        equal('18', '1:8', fixture);
        equal('19', '1:9', fixture);
        equal('20', '2:0', fixture);
        equal('21', '2:1', fixture);
        equal('22', '2:2', fixture);
        equal('23', '2:3', fixture);
        equal('24', '2:4', fixture);
        equal('25', '2:5', fixture);
        equal('1123', '11:23', fixture);
        equal('1323', '1:32', fixture);
        equal('1223', '12:23', fixture);
    });

    it('Date (Hh:m0:s0 apm=true', () => {
        component.mask = 'Hh:m0:s0';
        component.apm = true;
        equal('1323', '1:32:3', fixture);
        equal('1223', '12:23', fixture);
        equal('112322', '11:23:22', fixture);
        equal('13231', '1:32:31', fixture);
        equal('00', '0', fixture);
    });

    it('Date (d0/M0/0000 Hh:m0:s0 apm=true', () => {
        component.mask = 'd0/M0/0000 Hh:m0:s0';
        component.apm = true;
        equal('11122023', '11/12/2023', fixture);
        equal('11122023133456', '11/12/2023 1:33:45', fixture);
        equal('11/12/2023 13:32:30 ', '11/12/2023 1:33:23', fixture);
        equal('11/12/2023 12:32:30 ', '11/12/2023 12:32:30', fixture);
    });

    it('Date (0000-M0-d0 Hh:m0:s0.000', () => {
        component.mask = '0000-M0-d0 Hh:m0:s0.000';
        component.leadZeroDateTime = true;
        component.showMaskTyped = true;
        equal('2023', '2023-__-__ __:__:__.___', fixture);
        equal('202309', '2023-09-__ __:__:__.___', fixture);
        equal('20230931', '2023-09-31 __:__:__.___', fixture);
        equal('2023093123', '2023-09-31 23:__:__.___', fixture);
        equal('202309312344', '2023-09-31 23:44:__.___', fixture);
        equal('20230931234435', '2023-09-31 23:44:35.___', fixture);
        equal('20230920233003123', '2023-09-20 23:30:03.123', fixture);
    });

    it('Date (0000-M0-d0 leadZero and showMaskTyped', () => {
        component.mask = '0000-M0-d0';
        component.leadZeroDateTime = true;
        component.showMaskTyped = true;
        equal('2023', '2023-__-__', fixture);
        equal('202310', '2023-10-__', fixture);
        equal('20231029', '2023-10-29', fixture);
    });

    it('Date (0000/M0/d0 leadZero and showMaskTyped', () => {
        component.mask = '0000/M0/d0';
        component.leadZeroDateTime = true;
        component.showMaskTyped = true;
        equal('2023', '2023/__/__', fixture);
        equal('202312', '2023/12/__', fixture);
        equal('20231229', '2023/12/29', fixture);
    });

    it('Date (0000.M0.d0 leadZero and showMaskTyped', () => {
        component.mask = '0000.M0.d0';
        component.leadZeroDateTime = true;
        component.showMaskTyped = true;
        equal('2023', '2023.__.__', fixture);
        equal('202310', '2023.10.__', fixture);
        equal('20231031', '2023.10.31', fixture);
    });

    it('Date (0000.M0.d0 leadZero and showMaskTyped', () => {
        component.mask = 'M0/d0/0000';
        component.leadZeroDateTime = true;
        component.showMaskTyped = true;
        component.dropSpecialCharacters = false;
        equal('01', '01/__/____', fixture);
        equal('0109', '01/09/____', fixture);
        equal('01/03/2011', '01/03/2011', fixture);
    });

    it('Date (d0/M0/0000 leadZero)', () => {
        component.mask = 'M0/d0/0000';
        component.leadZeroDateTime = true;
        equal('4122000', '04/12/2000', fixture);
        equal('442000', '04/04/2000', fixture);
    });

    it('Date (0000-M0)', () => {
        component.mask = '0000-M0';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12341', '1234-1', fixture);
        equal('123412', '1234-12', fixture);
    });
    it('Date (0000/M0)', () => {
        component.mask = '0000/M0';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12341', '1234/1', fixture);
        equal('123412', '1234/12', fixture);
    });
    it('Date (0000:M0)', () => {
        component.mask = '0000:M0';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '123', fixture);
        equal('1234', '1234', fixture);
        equal('12341', '1234:1', fixture);
        equal('123412', '1234:12', fixture);
    });

    it('Date d0/M0', () => {
        component.mask = 'd0/M0';
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '12/3', fixture);
        equal('1234', '12/3', fixture);
        equal('33', '3/3', fixture);
    });

    it('Date d0/M0 with v', () => {
        component.mask = 'd0/M0';
        component.leadZeroDateTime = true;
        equal('1', '1', fixture);
        equal('12', '12', fixture);
        equal('123', '12/03', fixture);
        equal('1234', '12/03', fixture);
        equal('44', '04/04', fixture);
    });
});
