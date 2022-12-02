import discord
from discord.ext import commands

from .. import bot
from ..utils.constants import ACCENT_COLOR
from ..utils.views import DeleteButton

IOS_REQUEST_WORDS = (
    "kiedy",
    "będzie",
    "bedzie",
    "wulkanowy",
    "wulkanowego",
    "dostępny",
    "dostepny",
    "pobrać",
    "pobrac",
    "ogarnąć",
    "ogarnac",
)

IOS_NOTICE = (
    discord.Embed(title="Witam chyba nigdy", color=ACCENT_COLOR)
    .add_field(
        name="Długa odpowiedź:",
        value="""Niestety, Wulkanowy na iOS może się nigdy nie pojawić. Wynika to z kilku przyczyn. \
Najważniejszą jest brak czasu — Wulkanowy to projekt tworzony po godzinach przez grupę uczniów \
(niektórzy z nas już pracują) i nie mamy czasu na napisanie praktycznie całej aplikacji od nowa. \
Nie mówimy oczywiście kategorycznego „nie”, ale nie możemy zapewnić, \
że uda nam się kiedykolwiek wydać Wulkanowego na iOS.""",
        inline=False,
    )
    .add_field(
        name="Alternatywna aplikacja",
        value="""Możesz zapoznać się z aplikacją naszej zaprzyjaźnionej konkurencji — \
Vulcanova, która dostępna jest także na iOS! Dołącz na jej serwer Discord używając \
[tego linku](https://discord.gg/QJqu9gBZKt).""",
        inline=False,
    )
)


def is_ios_request(text: str, /) -> bool:
    if len(text) > 100:
        # the text is longer and doesn't look like just a simple question
        return False

    words = set(text.replace("?", "").replace("!", "").casefold().split())

    if all(word not in words for word in ("ios", "iphone", "apple")):
        return False

    return any(word in words for word in IOS_REQUEST_WORDS)


class Automod(commands.Cog):
    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        if message.author.bot:
            return

        if is_ios_request(message.content):
            view = DeleteButton(message.author)
            reply = await message.reply(embed=IOS_NOTICE, view=view)
            view.message = reply


async def setup(bot: bot.Wulkabot):
    await bot.add_cog(Automod())
