function getCombos(OriginalArray, RepeatStrings) {
    var OutputArray = [];
    function comboHelper(HolderArray, Iterator)
    {
        if (OriginalArray.length === HolderArray.length) {
            var HoldString = "";
            for (var I = 0; I < Iterator - 1; I++) {
                HoldString += (HolderArray[I] + ' ');
            }
            HoldString += HolderArray[Iterator - 1];
            OutputArray.push(HoldString);
        }
        if (OriginalArray.length < HolderArray.length)
        {
            HolderArray.length = null;
        }
        else
        {
            for (var I = 0; I < OriginalArray.length; I++)
            {
                var Hold = [];
                Hold.push(OriginalArray[I]);
                comboHelper(HolderArray.concat(Hold), Iterator + 1);
            }
        }
    }
    comboHelper([], 0);
    if (!RepeatStrings) {
        var FilteredOutput = [];
        var UniqueValues = new Set();
        var J = 0;
        for (var I = 0; I < OutputArray.length; I++) {
            var SplitString = OutputArray[I].split(' ');
            J = 0;
            UniqueValues.clear();
            while (J < SplitString.length) {
                UniqueValues.add(SplitString[J]);
                J++;
            }
            if (SplitString.length == UniqueValues.size) {
                FilteredOutput.push(OutputArray[I]);
            }
        }
        UniqueValues = null;
        OutputArray = null;
        return FilteredOutput;
    }
    return OutputArray;
}