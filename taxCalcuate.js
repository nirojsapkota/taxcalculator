var salary, isYearlyBonusApplicable, isCitDeposited, cit_amount_monthly, isMarried, isInsuranceDone, yearlyInsuranceAmount, taxableAmount,
    totalTax, firstSlabTax, secondSlabTax, thirdSlabTax, totaltaxable;
var citDepositedAmount = 0;
var firstSlabAmountRange = 300000;
var firstSlabAmountRangeUnmarried = 250000;
var secondSlabAmountRange = 100000;
var thirdSlabAmountRange = 100000;


$(document).ready(function () {

    $("#insurance_deposit").click(function () {
        if ($(this).prop("checked")) {
            isInsuranceDone = true;
            $("#insurance-div").show();

        } else {
            isInsuranceDone = false;

            $("#insurance-div").hide();
        }

    });

    $("#cit_deposit").click(function () {
        if ($(this).prop("checked")) {
            isCitDeposited = true;
            $("#cit-div").show();

        } else {
            isCitDeposited = false;

            $("#cit-div").hide();
        }

    });

    $("#tax-form").submit(function (e) {
        e.preventDefault();
        calculate();

    });


});


/*Math.round(input*100)/100
 done to round the value to 2 decimal places
 */
function calculate() {
    var salary = $("#salary_per_month").val();
    var yearlySalary;
    cit_amount_monthly = $("#cit_amount_monthly").val();
    yearlyInsuranceAmount = $("#insurance_amount").val();

    if ($("#is_married").prop("checked")) {
        isMarried = true;
    } else {
        isMarried = false;
    }

    if ($("#yearly_bonus").prop("checked")) {
        isYearlyBonusApplicable = true;
    } else {
        isYearlyBonusApplicable = false;
    }


    if (isYearlyBonusApplicable) {
        yearlySalary = salary * 13;
    } else {
        yearlySalary = salary * 12;
    }

    taxableAmount = yearlySalary;

    if (isCitDeposited) {
        citDepositedAmount = Math.round((cit_amount_monthly * 12) * 100) / 100;
        taxableAmount -= citDepositedAmount;
    }

    if (isInsuranceDone) {
        if (yearlyInsuranceAmount > 20000) {
            taxableAmount = (taxableAmount - 20000);
        } else {
            taxableAmount = (taxableAmount - yearlyInsuranceAmount);

        }
    }
    totaltaxable = taxableAmount;

    //now calculate tax
    if (!isMarried) {
        firstSlabAmountRange = firstSlabAmountRangeUnmarried;
    }

    if (taxableAmount >= firstSlabAmountRange) {
        firstSlabTax = Math.round(0.01 * firstSlabAmountRange * 100) / 100;
        taxableAmount -= firstSlabAmountRange;

    }
    //next slab 15% on 100000
    if (taxableAmount > secondSlabAmountRange) {
        secondSlabTax = 15000;
        taxableAmount -= secondSlabAmountRange;


    }
    //final slab i.e. upto 25l
    if (taxableAmount > 0 && taxableAmount < 2500000) {
        thirdSlabTax = Math.round(.25 * taxableAmount * 100) / 100;

    }

    totalTax = firstSlabTax + secondSlabTax + thirdSlabTax;


    var tax_per_month, taxdividedPer;
    if (isYearlyBonusApplicable) {
        tax_per_month = Math.round(totalTax / 13 * 100) / 100;
        taxdividedPer = 13;
    } else {
        tax_per_month = Math.round(totalTax / 12 * 100) / 100;
        taxdividedPer = 12;
    }
    var append_data = {
        monthly_salary: salary,
        cit_deposit: citDepositedAmount,
        insurance_deposit: Math.round(yearlyInsuranceAmount / 12 * 100) / 100,
        yearly_salary: yearlySalary,
        total_taxable: totaltaxable,
        first_slab: firstSlabTax,
        second_slab: secondSlabTax,
        third_slab: thirdSlabTax,
        total_tax: totalTax,
        tax_per_month: tax_per_month + " (/" + taxdividedPer + ")"
    }


    var source = $("#tax-template").html();
    var template = Handlebars.compile(source);
    var html = template(append_data);
    $("#tax-row").append(html);
    $("#info-table").show();


}


